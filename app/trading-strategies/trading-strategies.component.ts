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

    tradingStrategiesForm: NgForm;
    @ViewChild('tradingStrategiesForm') currentForm: NgForm;

    formErrors = {};

    validationMessages = {
        'tradingStrategyName': {
            'required': 'Strategy Name is required.',
            'maxlength': 'Strategy Name cannot be more than 50 characters long.',
            'pattern': 'Strategy Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'tradingStrategyDescription_': {
            'maxlength': 'Max Description length is 120 characters.'
        },
        'tradingStrategyClassname': {
            'required': 'Class name is required.',
            'maxlength': 'Class name cannot be more than 50 characters long.',
            'pattern': 'Class Name must be valid Java class, e.g. com.my.MyTradingStrategyClass'
        },
    };

    constructor(private tradingStrategyDataService: TradingStrategyHttpDataPromiseService,
                private marketDataService: MarketHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.exchangeId = params['id'];
            this.tradingStrategyDataService.getAllTradingStrategiesForExchange(this.exchangeId)
                .then(tradingStrategies => {
                    this.tradingStrategies = tradingStrategies;
                    this.updateFormErrors();
                });
        });
    }

    cancel() {
        this.router.navigate(['dashboard']);
    }


    addTradingStrategy(): void {
        // TODO - Check name given is unique for current Exchange
        this.tradingStrategies.push(new TradingStrategy(this.createUuid(), this.exchangeId, null, null, null));
        this.updateFormErrors();
    }

    deleteTradingStrategy(tradingStrategy: TradingStrategy): void {

        this.marketDataService.getAllMarketsForExchange(this.exchangeId)
            .then((markets) => {
                let marketsUsingTheStrategy = markets.filter(m => m.tradingStrategy.id === tradingStrategy.id);
                if (marketsUsingTheStrategy.length > 0) {
                    this.showCannotDeleteStrategyModal();
                } else {
                    this.tradingStrategies = this.tradingStrategies.filter(s => s.id !== tradingStrategy.id);
                    this.deletedTradingStrategies.push(tradingStrategy);
                    this.updateFormErrors();
                }
            });
    }

    save(isValid: boolean): void {

        if (isValid) {
            this.deletedTradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.deleteTradingStrategyById(tradingStrategy.id).then(() => {
                   // TODO - update any UI state?
                });
            });

            // TODO - Be more efficient: only update Strats that have changed
            this.tradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.updateTradingStrategy(tradingStrategy)
                    .then(() => this.cancel());
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

    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    createUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    updateFormErrors(): void {
        for (let i = 0; i < this.tradingStrategies.length; i++) {
            this.formErrors['tradingStrategyName_' + i] = '';
            this.formErrors['tradingStrategyDescription_' + i] = '';
            this.formErrors['tradingStrategyClassname_' + i] = '';
        }
    }

    // ------------------------------------------------------------------------
    // Form validation
    // ------------------------------------------------------------------------

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

