import {OnInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Params} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Exchange, ErrorCode, ErrorMessage, ExchangeRestClientService} from "../shared/index";

/**
 * Template-driven version of the Exchange Details form so I can decide which I like best.
 */
@Component({
    selector: 'bx-exchange-detail',
    templateUrl: 'app/exchange/exchange-detail.component.html',
    styleUrls: ['app/exchange/exchange-detail.component.css']
})
export class ExchangeDetailComponent implements OnInit {

    exchange: Exchange;
    selectedErrorCode: ErrorCode;
    selectedErrorMessage: ErrorMessage;
    active = true;

    constructor(private exchangeRestClientService: ExchangeRestClientService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeRestClientService.getExchange(id)
                .then(exchange => this.exchange = exchange);
        });
    }

    goBack(): void {
        window.history.back();
    }

    save(): void {
        this.exchangeRestClientService.update(this.exchange)
            .then(this.goBack);
    }

    onSelectErrorCode(selectedErrorCode: ErrorCode): void {
        this.selectedErrorCode = selectedErrorCode;
    }

    deleteErrorCode(code: ErrorCode): void {
        this.exchange.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchange.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);

        if (this.selectedErrorCode === code) {
            this.selectedErrorCode = null;
        }
    }

    addErrorCode(code: number): void {
        if (!code) {
            return;
        }

        this.exchange.networkConfig.nonFatalErrorHttpStatusCodes.push(new ErrorCode(code));
        this.selectedErrorCode = null;

        // TODO check this works - form reset hack until Google add this feature
        // this.active = false;
        // setTimeout(() => this.active = true, 0);
    }

    onSelectErrorMessage(selectedErrorMessage: ErrorMessage): void {
        this.selectedErrorMessage = selectedErrorMessage;
    }

    deleteErrorMessage(message: ErrorMessage): void {
        this.exchange.networkConfig.nonFatalErrorMessages =
            this.exchange.networkConfig.nonFatalErrorMessages.filter(m => m !== message);

        if (this.selectedErrorMessage === message) {
            this.selectedErrorMessage = null;
        }
    }

    addErrorMessage(message: string): void {
        if (!message) {
            return;
        }

        this.exchange.networkConfig.nonFatalErrorMessages.push(new ErrorMessage(message));
        this.selectedErrorMessage = null;

        // TODO check this works - form reset hack until Google add this feature
        // this.active = false;
        // setTimeout(() => this.active = true, 0);
    }

    // ------------------------------------------------------------------
    // Form validation
    // ------------------------------------------------------------------

    exchangeDetailsForm: NgForm;
    @ViewChild('exchangeDetailsForm') currentForm: NgForm;

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
    }

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
}

