import {OnInit, Component, ViewChild} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Exchange, ErrorCode, ErrorMessage, ExchangeRestClientService} from "../shared";

/**
 * Wrapper for Exchange Details.
 */
@Component({
    selector: 'bx-exchange-details',
    templateUrl: 'app/exchange-details/exchange-details.component.html',
    styleUrls: ['app/exchange-details/exchange-details.component.css']
})
export class ExchangeDetailsComponent implements OnInit {

    exchange: Exchange;
    active = true;

    constructor(private exchangeRestClientService: ExchangeRestClientService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeRestClientService.getExchange(id)
                .then(exchange => this.exchange = exchange);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    save(): void {
        this.exchangeRestClientService.update(this.exchange).then(
            exchange => {
                this.goToDashboard();
            });
    }

    addErrorCode(code: number): void {
        this.exchange.networkConfig.nonFatalErrorHttpStatusCodes.push(new ErrorCode(code));
    }

    deleteErrorCode(code: ErrorCode): void {
        this.exchange.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchange.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);
    }

    addErrorMessage(message: string): void {
        this.exchange.networkConfig.nonFatalErrorMessages.push(new ErrorMessage(message));
    }

    deleteErrorMessage(message: ErrorMessage): void {
        this.exchange.networkConfig.nonFatalErrorMessages =
            this.exchange.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
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
