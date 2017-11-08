import {OnInit, Component, ViewChild, AfterViewChecked} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Market, MarketHttpDataService} from '../model/market/';
import {Strategy, OptionalConfig, StrategyHttpDataService} from '../model/strategy';

/**
 * Template-driven version of the Markets form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-markets',
    templateUrl: 'markets.component.html',
    styleUrls: ['markets.component.css']
})
export class MarketsComponent implements OnInit, AfterViewChecked {

    markets: Market[] = [];
    deletedMarkets: Market[] = [];
    strategies: Strategy[] = [];
    botId;
    active = true;

    @ViewChild('marketsForm') currentForm: NgForm;
    marketsForm: NgForm;

    formErrors = {};

    validationMessages = {
        'marketName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -',
            'duplicateName': 'Market Name already in use on this Exchange. Please choose another.',
        },
        'counterCurrency': {
            'required': 'Counter Currency is required.',
            'pattern': 'Counter Currency must be valid 3 character currency id, e.g. BTC'
        },
        'baseCurrency': {
            'required': 'Base Currency is required.',
            'pattern': 'Base Currency must be valid 3 character currency id, e.g. USD'
        },
        'strategy': {
            'required': 'Strategy is required.'
        }
    };

    constructor(private marketDataService: MarketHttpDataService,
                private strategyDataService: StrategyHttpDataService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.botId = params['id'];
            this.marketDataService.getAllMarketsForBotId(this.botId)
                .then(markets => {
                    this.markets = markets;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});

        this.strategyDataService.getAllStrategiesForBotId(this.botId)
            .then(strategies => this.strategies = strategies);

    }

    getOtherMarketNames(marketId: string): string[] {
        const marketNames: string[] = [];
        for (let i = 0; i < this.markets.length; i++) {
            const market = this.markets[i];
            if (market.id !== marketId) { // excludes current market name
                marketNames.push(market.name);
            }
        }
        return marketNames;
    }

    addMarket(): void {
        const strategy = new Strategy(this.createUuid(), this.botId, null, null, null, new OptionalConfig([]));
        this.markets.push(new Market(this.createUuid(), this.botId, null, false, null, null, strategy));
        this.updateFormErrors();
    }

    deleteMarket(market: Market): void {
        this.markets = this.markets.filter(m => m !== market);
        this.deletedMarkets.push(market);
        this.updateFormErrors();
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.deletedMarkets.forEach((market) => {
                this.marketDataService.deleteMarketById(market.id).then(() => {/*done*/});
            });

            // TODO - Be more efficient: only update Markets that have changed
            this.markets.forEach((market) => {
                this.marketDataService.updateMarket(market)
                    .then(() => this.goToDashboard());
            });
        } else {
            this.onValueChanged(); // force validation for new untouched markets
        }
    }

    cancel() {
        this.goToDashboard();
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    createUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // tslint:disable-next-line
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    updateFormErrors(): void {
        for (let i = 0; i < this.markets.length; i++) {
            this.formErrors['marketName_' + i] = '';
            this.formErrors['baseCurrency_' + i] = '';
            this.formErrors['counterCurrency_' + i] = '';
            this.formErrors['strategy_' + i] = '';
        }
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------

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

                // 1st condition validates existing market; 2nd condition validates new market.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.marketsForm.submitted)) {
                    const messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
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

