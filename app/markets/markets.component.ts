import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {
    ErrorCode,
    ErrorMessage
} from '../model/exchange-adapter';
import {Market} from '../model/market/';
import {MarketHttpDataPromiseService} from '../model/market/market-http-data-promise.service';

/**
 * Template-driven version of the Markets form.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-markets',
    templateUrl: 'markets.component.html',
    styleUrls: ['markets.component.css']
})
export class MarketsComponent implements OnInit {

    markets: Market[] = [];
    active = true;

    @ViewChild('marketsForm') currentForm: NgForm;
    marketsForm: NgForm;

    formErrors = {
        'marketName': '',
        'connectionTimeout': ''
    };

    validationMessages = {
        'marketName': {
            'required': 'Market Name is required.',
            'maxlength': 'Market Name cannot be more than 120 characters long.'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        }
    };

    constructor(private marketDataService: MarketHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.marketDataService.getMarketsByExchangeId(id)
                .then(markets => this.markets = markets);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    save(): void {
        // this.marketDataService.update(this.exchangeAdapter)
        //     .then(() => this.goToDashboard());
    }

    addErrorCode(code: number): void {
        // this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(new ErrorCode(code));
    }

    deleteErrorCode(code: ErrorCode): void {
        // this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes =
        //     this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);
    }

    addErrorMessage(message: string): void {
        // this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push(new ErrorMessage(message));
    }

    deleteErrorMessage(message: ErrorMessage): void {
        // this.exchangeAdapter.networkConfig.nonFatalErrorMessages =
        //     this.exchangeAdapter.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
    }

    // ------------------------------------------------------------------
    // Form validation
    // ------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {
        if (this.currentForm === this.marketsForm) {
            return;
        }
        this.marketsForm = this.currentForm;
        if (this.marketsForm) {
            this.marketsForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {
        if (!this.marketsForm) {
            return;
        }
        const form = this.marketsForm.form;

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

