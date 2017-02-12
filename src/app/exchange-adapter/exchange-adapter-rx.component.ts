import {OnInit, Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {ExchangeAdapter, ErrorCode, ErrorMessage, ExchangeAdapterHttpDataObservableService} from '../model/exchange-adapter';

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/operator/map';

/**
 * Reactive (RxJS) version of the Exchange Adapter form.
 * See: https://angular.io/docs/ts/latest/guide/reactive-forms.html
 *
 * I'm still not convinced the Reactive form approach is better than the (far) simpler Template form approach -
 * there's so much more code to write... or am I being a noob and missing something here? ;-/
 *
 * For demo purposes, it uses the Observable implementation of the Exchange Adapter HTTP Data service.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-exchange-adapter-rx',
    templateUrl: 'exchange-adapter-rx.component.html',
    styleUrls: ['exchange-adapter.component.css']
})
export class ExchangeAdapterRxComponent implements OnInit {

    exchangeAdapter: ExchangeAdapter;
    active = true;
    public exchangeAdapterForm: FormGroup;
    errorMessage: string;
    formSaved = false;

    formErrors = {
        'adapterName': '',
        'className': '',
        'connectionTimeout': '',
        'nonFatalErrorHttpStatusCodes': '',
        'nonFatalErrorMessages': ''
    };

    validationMessages = {
        'adapterName': {
            'required': 'Adapter name is required.',
            'maxlength': 'Adapter name cannot be more than 50 characters long.',
            'pattern': 'Exchange Adapter Name must be set. Value must be alphanumeric and can only include the following '
                       + 'special characters: _ -'
        },
        'className': {
            'required': 'Adapter class name is required.',
            'maxlength': 'Adapter class name cannot be more than 120 characters long.',
            'pattern': 'Not a valid Java class name, e.g. com.my.strats.MyStrategy'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        },
        'nonFatalErrorHttpStatusCodes': {
            'required': 'HTTP error code must not be empty.',
            'pattern': 'HTTP error code must be a 3 digit number.',
            'httpCodeWhitelistChecker': 'HTTP Status Code not in whitelist.'
        },
        'nonFatalErrorMessages': {
            'required': 'Message must not be empty.',
            'maxlength': 'Message length cannot be more than 120 characters long.'
        }
    };

    constructor(private exchangeAdapterDataService: ExchangeAdapterHttpDataObservableService, private route: ActivatedRoute,
                private fb: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeAdapterDataService.getExchangeAdapterByExchangeId(id)
                .subscribe(exchangeAdapter => {
                    this.exchangeAdapter = exchangeAdapter;
                    this.buildForm();
                },
                error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
        }).then(() => {/*done*/});
    }

    goToDashboard(): void {
         this.router.navigate(['dashboard']);
    }

    save(isValid: boolean): void {
        this.formSaved = true;
        if (isValid) {

            // TODO - Must be better way to adapt domain model <-> form UI model?
            this.exchangeAdapter.id = this.exchangeAdapterForm.get('exchangeId').value;
            this.exchangeAdapter.name = this.exchangeAdapterForm.get('adapterName').value;
            this.exchangeAdapter.className = this.exchangeAdapterForm.get('className').value;
            this.exchangeAdapter.networkConfig.connectionTimeout = this.exchangeAdapterForm.get('connectionTimeout').value;

            // hack for now til I sort the JSON integration spec out with Spring Boot app
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length = 0;
            this.exchangeAdapterForm.get('nonFatalErrorHttpStatusCodes').value.forEach(
                (c) => this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push({'value': parseInt(c, 10)}));

            // hack for now til I sort the JSON integration spec out with Spring Boot app
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length = 0;
            this.exchangeAdapterForm.get('nonFatalErrorMessages').value.forEach(
                (m) => this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push({'value': m}));

            this.exchangeAdapterDataService.update(this.exchangeAdapter)
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
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.push(this.createErrorCodeGroup(new ErrorCode(null)));
    }

    deleteErrorCode(i: number): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.removeAt(i);
    }

    addErrorMessage(): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        control.push(this.createErrorMessageGroup(new ErrorMessage('')));
    }

    deleteErrorMessage(i: number): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        control.removeAt(i);
    }

    // ------------------------------------------------------------------
    // Form validation stuff
    // ------------------------------------------------------------------

    buildForm(): void {

        this.exchangeAdapterForm = this.fb.group({
            exchangeId: new FormControl({value: this.exchangeAdapter.id, disabled: true}, Validators.required),
            adapterName: [this.exchangeAdapter.name, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(50),
                Validators.pattern('[a-zA-Z0-9_\\- ]*')
            ]],
            className: [this.exchangeAdapter.className, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(120),
                Validators.pattern('([a-zA-Z_$][a-zA-Z0-9_$]*\.)*[a-zA-Z_$][a-zA-Z0-9_$]*')
            ]],
            connectionTimeout: [this.exchangeAdapter.networkConfig.connectionTimeout, [
                Validators.required,
                Validators.pattern('\\d+')
            ]],
            nonFatalErrorHttpStatusCodes: new FormArray([]),
            nonFatalErrorMessages: new FormArray([]),
        });

        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.forEach(
            (code) => this.nonFatalErrorHttpStatusCodes.push(this.createErrorCodeGroup(code))
        );

        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.forEach(
            (msg) => this.nonFatalErrorMessages.push(this.createErrorMessageGroup(msg))
        );

        this.exchangeAdapterForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    createErrorMessageGroup(errorMsg: ErrorMessage) {
        return new FormControl(errorMsg.value, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ]);
    }

    createErrorCodeGroup(code: ErrorCode) {
        return new FormControl(code.value, [
            Validators.required,
            Validators.pattern('\\d{3}'),
            this.httpCodeWhitelistChecker,
        ]);
    }

    get nonFatalErrorHttpStatusCodes(): FormArray {
        return this.exchangeAdapterForm.get('nonFatalErrorHttpStatusCodes') as FormArray;
    }

    get nonFatalErrorMessages(): FormArray {
        return this.exchangeAdapterForm.get('nonFatalErrorMessages') as FormArray;
    }

    onValueChanged(data?: any) {

        if (!this.exchangeAdapterForm) {
            return;
        }

        const form = this.exchangeAdapterForm;
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
        const errorCodeControl = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        errorCodeControl.controls.forEach((code) => {
            if (code && !code.valid) {
                this.formErrors['nonFatalErrorHttpStatusCodes'] = '';
                const messages = this.validationMessages['nonFatalErrorHttpStatusCodes'];
                for (const key in code.errors) {
                    if (code.errors.hasOwnProperty(key)) {
                        this.formErrors['nonFatalErrorHttpStatusCodes'] += messages[key] + ' ';
                    }
                }
            }
        });

        // Set errors for any invalid Error Messages
        const errorMessageControl = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        errorMessageControl.controls.forEach((msg) => {
            if (msg && !msg.valid) {
                this.formErrors['nonFatalErrorMessages'] = '';
                const messages = this.validationMessages['nonFatalErrorMessages'];
                for (const key in msg.errors) {
                    if (msg.errors.hasOwnProperty(key)) {
                        this.formErrors['nonFatalErrorMessages'] += messages[key] + ' ';
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



