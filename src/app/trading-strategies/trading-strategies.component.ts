import {OnInit, Component, ViewChild, AfterViewChecked} from '@angular/core';
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
    selector: 'app-bxbot-ui-trading-strategies',
    templateUrl: 'trading-strategies.component.html',
    styleUrls: ['trading-strategies.component.css']
})
export class TradingStrategiesComponent implements OnInit, AfterViewChecked {

    tradingStrategies: TradingStrategy[] = [];
    deletedTradingStrategies: TradingStrategy[] = [];
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
        }
    };

    errorModal = {
        'title': 'Trading Strategy Still In Use',
        'body': 'You cannot delete this Trading Strategy because it is still being used by a Market on the Exchange. ' +
                'Please check your Market configuration.'
    };

    constructor(private tradingStrategyDataService: TradingStrategyHttpDataPromiseService,
                private marketDataService: MarketHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.botId = params['id'];
            this.tradingStrategyDataService.getAllTradingStrategiesForBotId(this.botId)
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
        this.tradingStrategies.push(new TradingStrategy(this.createUuid(), this.botId, null, null, null));
        this.updateFormErrors();
    }

    deleteTradingStrategy(tradingStrategy: TradingStrategy): void {
        this.marketDataService.getAllMarketsForBotId(this.botId)
            .then((markets) => {
                const marketsUsingTheStrategy = markets.filter(m => m.tradingStrategyId === tradingStrategy.id);
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
                this.tradingStrategyDataService.deleteTradingStrategyById(tradingStrategy.id).then(() => {/*done*/});
            });

            // TODO - Be more efficient: only update Strats that have changed
            this.tradingStrategies.forEach((tradingStrategy) => {
                this.tradingStrategyDataService.updateTradingStrategy(tradingStrategy)
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
        for (let i = 0; i < this.tradingStrategies.length; i++) {
            this.formErrors['tradingStrategyName_' + i] = '';
            this.formErrors['tradingStrategyDescription_' + i] = '';
            this.formErrors['tradingStrategyClassname_' + i] = '';
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

