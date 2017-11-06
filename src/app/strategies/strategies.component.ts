import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {OptionalConfig, Strategy, ConfigItem, StrategyHttpDataService} from '../model/strategy';
import {MarketHttpDataPromiseService} from '../model/market';

/**
 * Template-driven version of the Strategies form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-trading-strategies',
    templateUrl: 'strategies.component.html',
    styleUrls: ['strategies.component.css']
})
export class TradingStrategiesComponent implements OnInit, AfterViewChecked {

    tradingStrategies: Strategy[] = [];
    deletedTradingStrategies: Strategy[] = [];
    botId;
    active = true;
    canDeleteStrategy = true;

    tradingStrategiesForm: NgForm;
    @ViewChild('tradingStrategiesForm') currentForm: NgForm;

    formErrors = {};

    validationMessages = {
        'tradingStrategyName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -',
            'duplicateName': 'Strategy Name already in use on this Exchange. Please choose another.',
        },
        'tradingStrategyDescription': {
            'maxlength': 'Description max length is 120 characters.'
        },
        'tradingStrategyClassname': {
            'required': 'Class Name is required.',
            'maxlength': 'Class Name max length is 50 characters.',
            'pattern': 'Class Name must be valid Java class, e.g. com.my.MyTradingStrategyClass'
        },
        'strategyConfigItemName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'strategyConfigItemValue': {
            'required': 'Value is required.',
            'maxlength': 'Value max length is 120 characters.'
        }
    };

    errorModal = {
        'title': 'Trading Strategy Still In Use',
        'body': 'You cannot delete this Trading Strategy because it is still being used by a Market on the Exchange. ' +
        'Please check your Market configuration.'
    };

    constructor(private tradingStrategyDataService: StrategyHttpDataService,
                private marketDataService: MarketHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.botId = params['id'];
            this.tradingStrategyDataService.getAllStrategiesForBotId(this.botId)
                .then(tradingStrategies => {
                    this.tradingStrategies = tradingStrategies;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});
    }

    getOtherStrategyNames(strategyId: string): string[] {
        const tradingStrategyNames: string[] = [];
        for (let i = 0; i < this.tradingStrategies.length; i++) {
            const tradingStrategy = this.tradingStrategies[i];
            if (tradingStrategy.id !== strategyId) { // excludes current strat name
                tradingStrategyNames.push(tradingStrategy.name);
            }
        }
        return tradingStrategyNames;
    }

    addTradingStrategy(): void {
        this.tradingStrategies.push(new Strategy(this.createUuid(), this.botId, null, null, null, new OptionalConfig([])));
        this.updateFormErrors();
    }

    deleteTradingStrategy(tradingStrategy: Strategy): void {
        this.marketDataService.getAllMarketsForBotId(this.botId)
            .then((markets) => {
                const marketsUsingTheStrategy = markets.filter(m => m.tradingStrategy.id === tradingStrategy.id);
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
                this.tradingStrategyDataService.deleteStrategyById(tradingStrategy.id).then(() => {/*done*/
                });
            });

            // TODO - Be more efficient: only update Strats that have changed
            this.tradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.updateStrategy(tradingStrategy)
                    .then(() => this.goToDashboard());
            });
        } else {
            this.onValueChanged(); // force validation for new untouched strats
        }
    }

    cancel() {
        this.goToDashboard();
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
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

    addOptionalConfigItem(strategy: Strategy): void {
        strategy.optionalConfig.configItems.push(new ConfigItem('', ''));
        this.updateFormErrors();
    }

    deleteOptionalConfigItem(selectedStrategy: Strategy, configItem: ConfigItem): void {
        this.tradingStrategies.forEach((s) => {
            if (s.id === selectedStrategy.id) {
                s.optionalConfig.configItems = s.optionalConfig.configItems.filter(c => c !== configItem);
            }
        });
        this.updateFormErrors();
    }

    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    createUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    updateFormErrors(): void {
        for (let i = 0; i < this.tradingStrategies.length; i++) {
            this.formErrors['tradingStrategyName_' + i] = '';
            this.formErrors['tradingStrategyDescription_' + i] = '';
            this.formErrors['tradingStrategyClassname_' + i] = '';

            for (let j = 0; j < this.tradingStrategies[i].optionalConfig.configItems.length; j++) {
                this.formErrors['strategyConfigItemName_' + i + '_' + j] = '';
                this.formErrors['strategyConfigItemValue_' + i + '_' + j] = '';
            }
        }
    }

    /**
     * Need this because we iterate over primitive arrays for errorCode and errorMessage:
     * https://stackoverflow.com/questions/42322968/angular2-dynamic-input-field-lose-focus-when-input-changes
     */
    trackByIndex(index: any, item: any) {
        return index;
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
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

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.tradingStrategiesForm.submitted)) {
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

