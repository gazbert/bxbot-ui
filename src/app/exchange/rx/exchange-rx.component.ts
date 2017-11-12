import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ConfigItem, Exchange, ExchangeHttpDataObservableService, OptionalConfig} from '../../model/exchange';
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/operator/map';

/**
 * Reactive (RxJS) version of the Exchange form.
 * See: https://angular.io/docs/ts/latest/guide/reactive-forms.html
 *
 * I'm still not convinced the Reactive form approach is better than the (far) simpler Template form approach -
 * there's so much more code to write... or am I being a noob and missing something here? ;-/
 *
 * For demo purposes, it uses the Observable implementation of the Exchange HTTP Data service.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-exchange-rx',
    templateUrl: 'exchange-rx.component.html',
    styleUrls: ['exchange-rx.component.css']
})
export class ExchangeRxComponent implements OnInit {

    exchange: Exchange;
    active = true;
    public exchangeForm: FormGroup;
    errorMessage: string;
    formSaved = false;

    formErrors = {
        'exchangeName': '',
        'className': '',
        'connectionTimeout': '',
        'nonFatalHttpStatusCode': '',
        'nonFatalErrorMessage': '',
        'exchangeConfigItemName': '',
        'exchangeConfigItemValue': ''
    };

    validationMessages = {
        'exchangeName': {
            'required': 'Exchange Name is required.',
            'maxlength': 'Exchange Name max length is 50 characters.',
            'pattern': 'Exchange Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'className': {
            'required': 'Class Name is required.',
            'maxlength': 'Class Name max length is 120 characters.',
            'pattern': 'Class Name must be valid Java class, e.g. com.my.MyExchangeAdapterClass'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        },
        'nonFatalHttpStatusCode': {
            'required': 'Connection timeout is required.',
            'pattern': 'HTTP Status Code must be a 3 digit number.',
            'httpCodeWhitelistChecker': 'HTTP Status Code not in whitelist.'
        },
        'nonFatalErrorMessage': {
            'required': 'Message must not be empty.',
            'maxlength': 'Message length cannot be more than 120 characters long.'
        },
        'exchangeConfigItemName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'exchangeConfigItemValue': {
            'required': 'Value is required.',
            'maxlength': 'Value max length is 120 characters.'
        }
    };

    constructor(private exchangeDataService: ExchangeHttpDataObservableService, private route: ActivatedRoute,
                private fb: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const botId = params['id'];
            this.exchangeDataService.getExchangeByBotId(botId)
                .subscribe(exchange => {
                        this.exchange = exchange;
                        this.buildForm();
                    },
                    error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
        }).then(() => {/*done*/
        });
    }

    goToDashboard(): void {
        this.router.navigate(['dashboard']);
    }

    save(isValid: boolean): void {
        this.formSaved = true;
        if (isValid) {

            // TODO - Must be better way to adapt domain model <-> form UI model?
            this.exchange.id = this.exchangeForm.get('botId').value;
            this.exchange.name = this.exchangeForm.get('exchangeName').value;
            this.exchange.className = this.exchangeForm.get('className').value;
            this.exchange.networkConfig.connectionTimeout = this.exchangeForm.get('connectionTimeout').value;

            this.exchange.networkConfig.nonFatalHttpStatusCodes.length = 0;
            this.exchangeForm.get('nonFatalHttpStatusCodes').value.forEach(
                (c) => this.exchange.networkConfig.nonFatalHttpStatusCodes.push(parseInt(c, 10)));

            this.exchange.networkConfig.nonFatalErrorMessages.length = 0;
            this.exchangeForm.get('nonFatalErrorMessages').value.forEach(
                (m) => this.exchange.networkConfig.nonFatalErrorMessages.push(m));

            this.exchange.optionalConfig.configItems.length = 0;
            this.exchangeForm.get('optionalConfigItems').value.forEach(
                (i) => {
                    const configItem = new ConfigItem(i.configItemName, i.configItemValue);
                    this.exchange.optionalConfig.configItems.push(configItem);
                });

            this.exchangeDataService.updateExchange(this.exchange)
                .subscribe(
                    () => this.goToDashboard(),
                    error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
        }
    }

    cancel(): void {
        this.goToDashboard();
    }

    isFormSaved() {
        return this.formSaved;
    }

    addErrorCode(): void {
        const control = <FormArray>this.exchangeForm.controls['nonFatalHttpStatusCodes'];
        control.push(this.createErrorCodeGroup(null));
    }

    deleteErrorCode(i: number): void {
        const control = <FormArray>this.exchangeForm.controls['nonFatalHttpStatusCodes'];
        control.removeAt(i);
    }

    addErrorMessage(): void {
        const control = <FormArray>this.exchangeForm.controls['nonFatalErrorMessages'];
        control.push(this.createErrorMessageGroup(''));
    }

    deleteErrorMessage(i: number): void {
        const control = <FormArray>this.exchangeForm.controls['nonFatalErrorMessages'];
        control.removeAt(i);
    }

    addOptionalConfigItem(): void {
        const control = <FormArray>this.exchangeForm.controls['optionalConfigItems'];
        control.push(this.createOptionalConfigItemGroup(new ConfigItem('', '')));
    }

    deleteOptionalConfigItem(i: number): void {
        const control = <FormArray>this.exchangeForm.controls['optionalConfigItems'];
        control.removeAt(i);
    }

    // ------------------------------------------------------------------
    // Form validation stuff
    // ------------------------------------------------------------------

    buildForm(): void {

        this.exchangeForm = this.fb.group({
            botId: new FormControl({value: this.exchange.id, disabled: true}, Validators.required),
            exchangeName: [this.exchange.name, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),
                Validators.pattern('[a-zA-Z0-9_\\- ]*')
            ]],
            className: [this.exchange.className, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(120),
                Validators.pattern('([a-zA-Z_$][a-zA-Z0-9_$]*\.)*[a-zA-Z_$][a-zA-Z0-9_$]*')
            ]],
            connectionTimeout: [this.exchange.networkConfig.connectionTimeout, [
                Validators.required,
                Validators.pattern('\\d+')
            ]],
            nonFatalHttpStatusCodes: new FormArray([]),
            nonFatalErrorMessages: new FormArray([]),
            optionalConfigItems: this.fb.array([])
        });

        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchange.networkConfig.nonFatalHttpStatusCodes.forEach(
            (code) => this.nonFatalHttpStatusCodes.push(this.createErrorCodeGroup(code))
        );

        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchange.networkConfig.nonFatalErrorMessages.forEach(
            (msg) => this.nonFatalErrorMessages.push(this.createErrorMessageGroup(msg))
        );

        // TODO - Must be better way to automatically init the arrays from the model?
        if (this.exchange.optionalConfig != null) {
            this.exchange.optionalConfig.configItems.forEach(
                (item) => this.optionalConfigItems.push(this.createOptionalConfigItemGroup(item))
            );
        } else {
            this.exchange.optionalConfig = new OptionalConfig([]);
        }

        this.exchangeForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    // Patch optional config items
    createOptionalConfigItemGroup(configItem: ConfigItem) {
        return this.fb.group({
            configItemName: [configItem.name,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(50),
                    Validators.pattern('[a-zA-Z0-9_\\-]*')
                ]
            ],
            configItemValue: [configItem.value,
                [
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(120)
                ]
            ]
        });
    }

    createErrorMessageGroup(errorMsg: string) {
        return new FormControl(errorMsg, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ]);
    }

    createErrorCodeGroup(code: number) {
        return new FormControl(code, [
            Validators.required,
            Validators.pattern('\\d{3}'),
            this.httpCodeWhitelistChecker,
        ]);
    }

    get nonFatalHttpStatusCodes(): FormArray {
        return this.exchangeForm.get('nonFatalHttpStatusCodes') as FormArray;
    }

    get nonFatalErrorMessages(): FormArray {
        return this.exchangeForm.get('nonFatalErrorMessages') as FormArray;
    }

    get optionalConfigItems(): FormArray {
        return this.exchangeForm.get('optionalConfigItems') as FormArray;
    }

    onValueChanged(data?: any) {

        if (!this.exchangeForm) {
            return;
        }

        const form = this.exchangeForm;
        for (const field in this.formErrors) {

            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }

        // Set errors for any invalid Error Codes
        const errorCodeControl = <FormArray>this.exchangeForm.controls['nonFatalHttpStatusCodes'];
        errorCodeControl.controls.forEach((code) => {
            if (code && !code.valid) {
                this.formErrors['nonFatalHttpStatusCode'] = '';
                const messages = this.validationMessages['nonFatalHttpStatusCode'];
                for (const key in code.errors) {
                    if (code.errors.hasOwnProperty(key)) {
                        this.formErrors['nonFatalHttpStatusCode'] += messages[key] + ' ';
                    }
                }
            }
        });

        // Set errors for any invalid Error Messages
        const errorMessageControl = <FormArray>this.exchangeForm.controls['nonFatalErrorMessages'];
        errorMessageControl.controls.forEach((msg) => {
            if (msg && !msg.valid) {
                this.formErrors['nonFatalErrorMessage'] = '';
                const messages = this.validationMessages['nonFatalErrorMessage'];
                for (const key in msg.errors) {
                    if (msg.errors.hasOwnProperty(key)) {
                        this.formErrors['nonFatalErrorMessage'] += messages[key] + ' ';
                    }
                }
            }
        });

        // Set errors for any invalid Config Items - this is horrible...
        const configItemsControl = <FormArray>this.exchangeForm.controls['optionalConfigItems'];

        configItemsControl.controls.forEach((item) => {
            const configItemNameControl = item['controls'].configItemName;
            if (configItemNameControl && !configItemNameControl.valid) {
                this.formErrors['exchangeConfigItemName'] = '';
                const configItemNames = this.validationMessages['exchangeConfigItemName'];
                for (const key in configItemNameControl.errors) {
                    if (configItemNameControl.errors.hasOwnProperty(key)) {
                        this.formErrors['exchangeConfigItemName'] += configItemNames[key] + ' ';
                    }
                }
            }
        });

        configItemsControl.controls.forEach((item) => {
            const configItemValueControl = item['controls'].configItemValue;
            if (configItemValueControl && !configItemValueControl.valid) {
                this.formErrors['exchangeConfigItemValue'] = '';
                const configItemValues = this.validationMessages['exchangeConfigItemValue'];
                for (const key in configItemValueControl.errors) {
                    if (configItemValueControl.errors.hasOwnProperty(key)) {
                        this.formErrors['exchangeConfigItemValue'] += configItemValues[key] + ' ';
                    }
                }
            }
        });

        // reset so we don't error new (empty) errorCode/errorMsg before user gets chance to save
        if (form.valid) {
            this.formSaved = false;
        }
    }

    /**
     * Here for demo purposes only. Shows how to use custom validation in a Reactive form.
     */
    httpCodeWhitelistChecker(control: FormControl) {
        // TODO - Get from config or someplace else...
        const httpCodeWhitelist = ['501', '502', '503', '504', '524', '525', '522'];
        if (control && control.dirty) {
            const httpStatusCode = control.value;

            const validCode = httpCodeWhitelist.some((code) => {
                return code === httpStatusCode;
            });

            return validCode ? null : {'httpCodeWhitelistChecker': {httpStatusCode}};
        } else {
            return null;
        }
    }
}
