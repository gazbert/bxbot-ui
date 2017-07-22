"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var trading_strategy_1 = require("../model/trading-strategy");
var trading_strategy_2 = require("../model/trading-strategy");
var market_1 = require("../model/market");
/**
 * Template-driven version of the Trading Strategies form.
 *
 * @author gazbert
 */
var TradingStrategiesComponent = (function () {
    function TradingStrategiesComponent(tradingStrategyDataService, marketDataService, route, router) {
        this.tradingStrategyDataService = tradingStrategyDataService;
        this.marketDataService = marketDataService;
        this.route = route;
        this.router = router;
        this.tradingStrategies = [];
        this.deletedTradingStrategies = [];
        this.active = true;
        this.canDeleteStrategy = true;
        this.formErrors = {};
        this.validationMessages = {
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
        this.errorModal = {
            'title': 'Trading Strategy Still In Use',
            'body': 'You cannot delete this Trading Strategy because it is still being used by a Market on the Exchange. ' +
                'Please check your Market configuration.'
        };
    }
    TradingStrategiesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.botId = params['id'];
            _this.tradingStrategyDataService.getAllTradingStrategiesForBotId(_this.botId)
                .then(function (tradingStrategies) {
                _this.tradingStrategies = tradingStrategies;
                _this.updateFormErrors();
            });
        }).then(function () { });
    };
    TradingStrategiesComponent.prototype.getOtherStrategyNames = function (strategyId) {
        var tradingStrategyNames = [];
        for (var i = 0; i < this.tradingStrategies.length; i++) {
            var tradingStrategy = this.tradingStrategies[i];
            if (tradingStrategy.id !== strategyId) {
                tradingStrategyNames.push(tradingStrategy.name);
            }
        }
        return tradingStrategyNames;
    };
    TradingStrategiesComponent.prototype.addTradingStrategy = function () {
        this.tradingStrategies.push(new trading_strategy_1.TradingStrategy(this.createUuid(), this.botId, null, null, null));
        this.updateFormErrors();
    };
    TradingStrategiesComponent.prototype.deleteTradingStrategy = function (tradingStrategy) {
        var _this = this;
        this.marketDataService.getAllMarketsForBotId(this.botId)
            .then(function (markets) {
            var marketsUsingTheStrategy = markets.filter(function (m) { return m.tradingStrategy.id === tradingStrategy.id; });
            if (marketsUsingTheStrategy.length > 0) {
                _this.showCannotDeleteStrategyModal();
            }
            else {
                _this.tradingStrategies = _this.tradingStrategies.filter(function (s) { return s.id !== tradingStrategy.id; });
                _this.deletedTradingStrategies.push(tradingStrategy);
                _this.updateFormErrors();
            }
        });
    };
    TradingStrategiesComponent.prototype.save = function (isValid) {
        var _this = this;
        if (isValid) {
            this.deletedTradingStrategies.forEach(function (tradingStrategy) {
                _this.tradingStrategyDataService.deleteTradingStrategyById(tradingStrategy.id).then(function () { });
            });
            // TODO - Be more efficient: only update Strats that have changed
            this.tradingStrategies.forEach(function (tradingStrategy) {
                _this.tradingStrategyDataService.updateTradingStrategy(tradingStrategy)
                    .then(function () { return _this.goToDashboard(); });
            });
        }
        else {
            this.onValueChanged(); // force validation for new untouched strats
        }
    };
    TradingStrategiesComponent.prototype.cancel = function () {
        this.goToDashboard();
    };
    TradingStrategiesComponent.prototype.goToDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    TradingStrategiesComponent.prototype.canBeDeleted = function () {
        return this.tradingStrategies.length > 1;
    };
    TradingStrategiesComponent.prototype.showCannotDeleteStrategyModal = function () {
        this.canDeleteStrategy = false;
    };
    TradingStrategiesComponent.prototype.hideCannotDeleteStrategyModal = function () {
        this.canDeleteStrategy = true;
    };
    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    TradingStrategiesComponent.prototype.createUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    TradingStrategiesComponent.prototype.updateFormErrors = function () {
        for (var i = 0; i < this.tradingStrategies.length; i++) {
            this.formErrors['tradingStrategyName_' + i] = '';
            this.formErrors['tradingStrategyDescription_' + i] = '';
            this.formErrors['tradingStrategyClassname_' + i] = '';
        }
    };
    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------
    TradingStrategiesComponent.prototype.ngAfterViewChecked = function () {
        this.formChanged();
    };
    TradingStrategiesComponent.prototype.formChanged = function () {
        var _this = this;
        if (this.currentForm === this.tradingStrategiesForm) {
            return;
        }
        this.tradingStrategiesForm = this.currentForm;
        if (this.tradingStrategiesForm) {
            this.tradingStrategiesForm.valueChanges
                .subscribe(function (data) { return _this.onValueChanged(data); });
        }
    };
    TradingStrategiesComponent.prototype.onValueChanged = function (data) {
        if (!this.tradingStrategiesForm) {
            return;
        }
        var form = this.tradingStrategiesForm.form;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.tradingStrategiesForm.submitted)) {
                    var messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    };
    return TradingStrategiesComponent;
}());
__decorate([
    core_1.ViewChild('tradingStrategiesForm'),
    __metadata("design:type", forms_1.NgForm)
], TradingStrategiesComponent.prototype, "currentForm", void 0);
TradingStrategiesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-trading-strategies',
        templateUrl: 'trading-strategies.component.html',
        styleUrls: ['trading-strategies.component.css']
    }),
    __metadata("design:paramtypes", [trading_strategy_2.TradingStrategyHttpDataPromiseService,
        market_1.MarketHttpDataPromiseService, router_1.ActivatedRoute,
        router_1.Router])
], TradingStrategiesComponent);
exports.TradingStrategiesComponent = TradingStrategiesComponent;
//# sourceMappingURL=trading-strategies.component.js.map