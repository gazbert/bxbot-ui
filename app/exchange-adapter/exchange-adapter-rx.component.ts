import {OnInit, Component} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from "@angular/forms";
import {ExchangeAdapter, ErrorCode, ErrorMessage, ExchangeAdapterHttpDataObservableService} from "../model/exchange-adapter";

// NOTE: We need to explicitly pull the rxjs operators in - if not, we get a stinky runtime error e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/operator/map';

/**
 * Reactive version of the Exchange Adapter form.
 *
 * For demo purposes, it uses the Observable flavour of the Exchange HTTP data service.
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

    constructor(private exchangeAdapterDataService: ExchangeAdapterHttpDataObservableService, private route: ActivatedRoute,
                private fb: FormBuilder, private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeAdapterDataService.getExchangeAdapterByExchangeId(id)
                .subscribe(exchangeAdapter => {
                    this.exchangeAdapter = exchangeAdapter[0]; // TODO hack for in memory service returning an array
                    this.buildForm();
                },
                error => this.errorMessage = <any>error); // TODO show meaningful error to user
        });
    }

    goToDashboard(): void {
         this.router.navigate(['dashboard']);
    }

    save(): void {

        // TODO Must be better way to adapt/map domain model <-> form UI model?
        this.exchangeAdapter.id = this.exchangeAdapterForm.get('exchangeId').value;
        this.exchangeAdapter.adapter = this.exchangeAdapterForm.get('adapter').value;
        this.exchangeAdapter.networkConfig.connectionTimeout = this.exchangeAdapterForm.get('connectionTimeout').value;

        // hack for now til I sort the JSON integration spec out with Boot app
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length = 0;
        this.exchangeAdapterForm.get('nonFatalErrorHttpStatusCodes').value.forEach(
            (c) => this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push({"value": parseInt(c)}));

        // hack for now til I sort the JSON integration spec out with Boot app
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length = 0;
        this.exchangeAdapterForm.get('nonFatalErrorMessages').value.forEach(
            (m) => this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push({"value": m}));

        this.exchangeAdapterDataService.update(this.exchangeAdapter)
            .subscribe(
                exchangeAdapter => {this.goToDashboard()},
                error => this.errorMessage = <any>error); // TODO show meaningful error to user
    }

    addErrorCode(): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.push(this.createNewErrorCodeGroup());
    }

    deleteErrorCode(i: number): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.removeAt(i);
    }

    addErrorMessage(): void {
        const control = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        control.push(this.createNewErrorMessageGroup());
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
            adapter: [this.exchangeAdapter.adapter, [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(120),
                Validators.pattern('([a-zA-Z_$][a-zA-Z\\d_$]*\.)*[a-zA-Z_$][a-zA-Z\\d_$]*')
            ]],
            connectionTimeout: [this.exchangeAdapter.networkConfig.connectionTimeout, [
                Validators.required,
                Validators.pattern('\\d+')
            ]],
            nonFatalErrorHttpStatusCodes: new FormArray([]),
            nonFatalErrorMessages: new FormArray([]),
        });

        // TODO Must be better way to automatically init the arrays from the model??
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.forEach(
            (code) => this.nonFatalErrorHttpStatusCodes.push(this.createErrorCodeGroup(code))
        );

        // TODO Must be better way to automatically init the arrays from the model??
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.forEach(
            (msg) => this.nonFatalErrorMessages.push(this.createErrorMessageGroup(msg))
        );

        this.exchangeAdapterForm.valueChanges.subscribe(data => this.onValueChanged(data));
        this.onValueChanged(); // (re)set validation messages now
    }

    // TODO merge these 2 creates
    createErrorMessageGroup(errorMsg: ErrorMessage) {
        return new FormControl(errorMsg.value, [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ])
    }
    createNewErrorMessageGroup() {
        return new FormControl('', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(120),
        ])
    }

    // TODO merge these 2 creates
    createErrorCodeGroup(code: ErrorCode) {
        return new FormControl(code.value, [
            Validators.required,
            Validators.pattern('\\d{3}'),
            this.httpCodeWhitelistChecker,
        ])
    }
    createNewErrorCodeGroup() {
        return new FormControl('', [
            Validators.required,
            Validators.pattern('\\d{3}'),
            this.httpCodeWhitelistChecker,
        ])
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
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }

        // TODO hack to go though error codes - FIX needed to id individual inputs else we duplicate validation messages!
        const errorCodeControl = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        errorCodeControl.controls.forEach((code) => {
            if (code && code.dirty && !code.valid) {
                this.formErrors['nonFatalErrorHttpStatusCodes'] = '';
                const messages = this.validationMessages['nonFatalErrorHttpStatusCodes'];
                for (const key in code.errors) {
                    this.formErrors['nonFatalErrorHttpStatusCodes'] += messages[key] + ' ';
                }
            }
        });

        // TODO hack to go though error messages - FIX needed to id individual inputs else we duplicate validation messages!
        const errorMessageControl = <FormArray>this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        errorMessageControl.controls.forEach((msg) => {
            if (msg && msg.dirty && !msg.valid) {
                this.formErrors['nonFatalErrorMessages'] = '';
                const messages = this.validationMessages['nonFatalErrorMessages'];
                for (const key in msg.errors) {
                    this.formErrors['nonFatalErrorMessages'] += messages[key] + ' ';
                }
            }
        });
    }

    httpCodeWhitelistChecker(control: FormControl) {
        // TODO get from config or wherever
        const httpCodeWhitelist = ['501', '502', '503', '504'];
        if (control && control.dirty) {
            const httpStatusCode = control.value;
            const validCode = httpCodeWhitelist.includes(httpStatusCode);
            return validCode ? null : {'httpCodeWhitelistChecker': {httpStatusCode}};
        } else {
            return null;
        }
    }

    formErrors = {
        'adapter': '',
        'connectionTimeout': '',
        'nonFatalErrorHttpStatusCodes': '',
        'nonFatalErrorMessages': ''
    };

    validationMessages = {
        'adapter': {
            'required': 'Adapter name is required.',
            'maxlength': 'Adapter name cannot be more than 120 characters long.',
            'pattern': 'Not a valid fully qualified Java class name.'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        },
        'nonFatalErrorHttpStatusCodes': {
            'required': 'Code must not be empty.',
            'pattern': 'Code must be a 3 digit number.',
            'httpCodeWhitelistChecker': 'HTTP Status Code not in whitelist.'
        },
        'nonFatalErrorMessages': {
            'required': 'Message must not be empty.',
            'maxlength': 'Message length cannot be more than 120 characters long.'
        }
    };
}



