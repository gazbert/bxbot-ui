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
var _1 = require("../model/market/");
var trading_strategy_1 = require("../model/trading-strategy");
/**
 * Template-driven version of the Markets form.
 *
 * @author gazbert
 */
var MarketsComponent = (function () {
    function MarketsComponent(marketDataService, tradingStrategyDataService, route, router) {
        this.marketDataService = marketDataService;
        this.tradingStrategyDataService = tradingStrategyDataService;
        this.route = route;
        this.router = router;
        this.markets = [];
        this.deletedMarkets = [];
        this.tradingStrategies = [];
        this.active = true;
        this.formErrors = {};
        this.validationMessages = {
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
            'tradingStrategy': {
                'required': 'Trading Strategy is required.'
            }
        };
    }
    MarketsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.botId = params['id'];
            _this.marketDataService.getAllMarketsForBotId(_this.botId)
                .then(function (markets) {
                _this.markets = markets;
                _this.updateFormErrors();
            });
        }).then(function () { });
        this.tradingStrategyDataService.getAllTradingStrategiesForBotId(this.botId)
            .then(function (tradingStrategies) { return _this.tradingStrategies = tradingStrategies; });
    };
    MarketsComponent.prototype.getOtherMarketNames = function (marketId) {
        var marketNames = [];
        for (var i = 0; i < this.markets.length; i++) {
            var market = this.markets[i];
            if (market.id !== marketId) {
                marketNames.push(market.name);
            }
        }
        return marketNames;
    };
    MarketsComponent.prototype.addMarket = function () {
        var tradingStrategy = new trading_strategy_1.TradingStrategy(this.createUuid(), this.botId, null, null, null);
        this.markets.push(new _1.Market(this.createUuid(), this.botId, null, false, null, null, tradingStrategy));
        this.updateFormErrors();
    };
    MarketsComponent.prototype.deleteMarket = function (market) {
        this.markets = this.markets.filter(function (m) { return m !== market; });
        this.deletedMarkets.push(market);
        this.updateFormErrors();
    };
    MarketsComponent.prototype.save = function (isValid) {
        var _this = this;
        if (isValid) {
            this.deletedMarkets.forEach(function (market) {
                _this.marketDataService.deleteMarketById(market.id).then(function () { });
            });
            // TODO - Be more efficient: only update Markets that have changed
            this.markets.forEach(function (market) {
                _this.marketDataService.updateMarket(market)
                    .then(function () { return _this.goToDashboard(); });
            });
        }
        else {
            this.onValueChanged(); // force validation for new untouched markets
        }
    };
    MarketsComponent.prototype.cancel = function () {
        this.goToDashboard();
    };
    MarketsComponent.prototype.goToDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    MarketsComponent.prototype.createUuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };
    MarketsComponent.prototype.updateFormErrors = function () {
        for (var i = 0; i < this.markets.length; i++) {
            this.formErrors['marketName_' + i] = '';
            this.formErrors['baseCurrency_' + i] = '';
            this.formErrors['counterCurrency_' + i] = '';
            this.formErrors['tradingStrategy_' + i] = '';
        }
    };
    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------
    MarketsComponent.prototype.ngAfterViewChecked = function () {
        this.formChanged();
    };
    MarketsComponent.prototype.formChanged = function () {
        var _this = this;
        if (this.currentForm === this.marketsForm) {
            return;
        }
        this.marketsForm = this.currentForm;
        if (this.marketsForm) {
            this.marketsForm.valueChanges
                .subscribe(function (data) { return _this.onValueChanged(data); });
        }
    };
    MarketsComponent.prototype.onValueChanged = function (data) {
        if (!this.marketsForm) {
            return;
        }
        var form = this.marketsForm.form;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                // 1st condition validates existing market; 2nd condition validates new market.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.marketsForm.submitted)) {
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
    return MarketsComponent;
}());
__decorate([
    core_1.ViewChild('marketsForm'),
    __metadata("design:type", forms_1.NgForm)
], MarketsComponent.prototype, "currentForm", void 0);
MarketsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-markets',
        templateUrl: 'markets.component.html',
        styleUrls: ['markets.component.css']
    }),
    __metadata("design:paramtypes", [_1.MarketHttpDataPromiseService,
        trading_strategy_1.TradingStrategyHttpDataPromiseService, router_1.ActivatedRoute,
        router_1.Router])
], MarketsComponent);
exports.MarketsComponent = MarketsComponent;
//# sourceMappingURL=markets.component.js.map