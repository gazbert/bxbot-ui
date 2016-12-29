import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {TradingStrategy} from '../model/trading-strategy';
import {TradingStrategyHttpDataPromiseService} from '../model/trading-strategy';
import {MarketHttpDataPromiseService} from '../model/market';

/**
 * Template-driven version of the Trading Strategies form.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-trading-strategies',
    templateUrl: 'trading-strategies.component.html',
    styleUrls: ['trading-strategies.component.css']
})
export class TradingStrategiesComponent implements OnInit {

    tradingStrategies: TradingStrategy[] = [];
    deletedTradingStrategies: TradingStrategy[] = [];
    exchangeId;
    active = true;
    canDeleteStrategy = true;

    @ViewChild('tradingStrategiesForm') currentForm: NgForm;
    tradingStrategiesForm: NgForm;

    formErrors = {
        'id': '',
        'name': ''
        // etc...
    };

    validationMessages = {
        'id': {
            'required': 'Id is required.',
            'maxlength': 'Id cannot be more than 120 characters long.'
        },
        'name': {
            'required': 'Name is required.',
            'maxlength': 'Name cannot be more than 120 characters long.'
        }
    };

    constructor(private tradingStrategyDataService: TradingStrategyHttpDataPromiseService,
                private marketDataService: MarketHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.exchangeId = params['id'];
            this.tradingStrategyDataService.getAllTradingStrategiesForExchange(this.exchangeId)
                .then(tradingStrategies => this.tradingStrategies = tradingStrategies);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }


    addTradingStrategy(): void {
        // TODO check name given is unique for current Exchange
        this.tradingStrategies.push(new TradingStrategy(this.createUuid(), this.exchangeId, null, null, null));
    }

    deleteTradingStrategy(tradingStrategy: TradingStrategy): void {

        this.marketDataService.getAllMarketsForExchange(this.exchangeId)
            .then((markets) => {
                let marketsUsingTheStrategy = markets.filter(m => m.tradingStrategy.name === tradingStrategy.name);
                if (marketsUsingTheStrategy.length > 0) {
                    this.showCannotDeleteStrategyModal();
                } else {
                    this.tradingStrategies = this.tradingStrategies.filter(m => m !== tradingStrategy);
                    this.deletedTradingStrategies.push(tradingStrategy);
                }
            });
    }

    save(isValid: boolean): void {

        if (isValid) {
            this.deletedTradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.deleteTradingStrategyById(tradingStrategy.id);
            });

            // TODO Only update Strats that have changed
            this.tradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.updateTradingStrategy(tradingStrategy)
                    .then(() => this.goToDashboard());
            });
        }
    }

    canBeDeleted() {
        return this.tradingStrategies.length > 1;
    }

    showCannotDeleteStrategyModal(): void {
        this.canDeleteStrategy = false;
    }

    hideCannotDeleteStrategyModal(): void {
        this.canDeleteStrategy = true;
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
        if (this.currentForm === this.tradingStrategiesForm) {
            return;
        }
        this.tradingStrategiesForm = this.currentForm;
        if (this.tradingStrategiesForm) {
            this.tradingStrategiesForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {
        if (!this.tradingStrategiesForm) {
            return;
        }
        const form = this.tradingStrategiesForm.form;

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

