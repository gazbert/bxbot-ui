import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Market, MarketHttpDataPromiseService} from '../model/market/';
import {TradingStrategy, TradingStrategyHttpDataPromiseService} from '../model/trading-strategy';

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
    deletedMarkets: Market[] = [];
    tradingStrategies: TradingStrategy[] = [];
    exchangeId;
    active = true;

    @ViewChild('marketsForm') currentForm: NgForm;
    marketsForm: NgForm;

    formErrors = {
        'marketName': '',
        'counterCurrency': ''
        // etc...
    };

    validationMessages = {
        'marketName': {
            'required': 'Market Name is required.',
            'maxlength': 'Market Name cannot be more than 120 characters long.'
        },
        'counterCurrency': {
            'required': 'Counter Currency is required.',
            'pattern': 'Counter Currency must be 3 character currency id, e.g. BTC'
        }
    };

    constructor(private marketDataService: MarketHttpDataPromiseService,
                private tradingStrategyDataService: TradingStrategyHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.exchangeId = params['id'];
            this.marketDataService.getAllMarketsForExchange(this.exchangeId)
                .then(markets => this.markets = markets);

            this.tradingStrategyDataService.getAllTradingStrategiesForExchange(this.exchangeId)
                .then(tradingStrategies => this.tradingStrategies = tradingStrategies);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    addMarket(): void {

        // TODO check name given is unique for current Exchange
        let tradingStrategy = new TradingStrategy(this.createUuid(), this.exchangeId, null, null, null);
        this.markets.push(new Market(null, null, this.exchangeId , false, null, null, tradingStrategy));
    }

    deleteMarket(market: Market): void {
        this.markets = this.markets.filter(m => m !== market);
        this.deletedMarkets.push(market);
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.deletedMarkets.forEach((market) => {
                this.marketDataService.deleteMarketById(market.id);
            });

            // TODO Only update Markets that have changed
            this.markets.forEach((market) => {
                this.marketDataService.updateMarket(market)
                    .then(() => this.goToDashboard());
            });
        }
    }

    // TODO Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    createUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    // ------------------------------------------------------------------
    // Form validation
    // TODO Need to rework to cater for multiple market entries... leave validation in HTML for now
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

