import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {
    ExchangeAdapter,
    ErrorCode,
    ErrorMessage,
    ExchangeAdapterHttpDataPromiseService
} from '../model/exchange-adapter';

/**
 * Template-driven version of the Exchange Adapter form.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-exchange-adapter',
    templateUrl: 'exchange-adapter.component.html',
    styleUrls: ['exchange-adapter.component.css']
})
export class ExchangeAdapterComponent implements OnInit {

    exchangeAdapter: ExchangeAdapter;
    active = true;

    @ViewChild('exchangeDetailsForm') currentForm: NgForm;
    exchangeDetailsForm: NgForm;

    formErrors = {
        'adapter': '',
        'connectionTimeout': ''
    };

    validationMessages = {
        'adapter': {
            'required': 'Adapter Name is required.',
            'maxlength': 'Adapter Name cannot be more than 120 characters long.'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        }
    };

    constructor(private exchangeAdapterDataService: ExchangeAdapterHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeAdapterDataService.getExchangeAdapterByExchangeId(id)
                .then(exchangeAdapter => this.exchangeAdapter = exchangeAdapter);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.exchangeAdapterDataService.update(this.exchangeAdapter)
                .then(() => this.goToDashboard());
        }
    }

    addErrorCode(): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(new ErrorCode(null));
    }

    deleteErrorCode(code: ErrorCode): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);
    }

    addErrorMessage(message: string): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push(new ErrorMessage(message));
    }

    deleteErrorMessage(message: ErrorMessage): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages =
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
    }

    // ------------------------------------------------------------------
    // Form validation
    // ------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {
        if (this.currentForm === this.exchangeDetailsForm) {
            return;
        }
        this.exchangeDetailsForm = this.currentForm;
        if (this.exchangeDetailsForm) {
            this.exchangeDetailsForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {
        if (!this.exchangeDetailsForm) {
            return;
        }
        const form = this.exchangeDetailsForm.form;

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
    }
}

