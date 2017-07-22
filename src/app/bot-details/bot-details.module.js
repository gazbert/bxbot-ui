"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var platform_browser_1 = require("@angular/platform-browser");
var bot_details_component_1 = require("./bot-details.component");
var _1 = require("./tabs/");
var exchange_adapter_module_1 = require("../exchange-adapter/exchange-adapter.module");
var markets_module_1 = require("../markets/markets.module");
var email_alerts_module_1 = require("../email-alerts/email-alerts.module");
var shared_module_1 = require("../shared/shared.module");
var trading_strategies_module_1 = require("../trading-strategies/trading-strategies.module");
var routes = [
    {
        path: 'bot/:id', component: bot_details_component_1.BotDetailsComponent
    }
];
/**
 * Container module for holding the bot's config and status screens.
 *
 * @author gazbert
 */
var ExchangeDetailsModule = (function () {
    function ExchangeDetailsModule() {
    }
    return ExchangeDetailsModule;
}());
ExchangeDetailsModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            exchange_adapter_module_1.ExchangeAdapterModule,
            email_alerts_module_1.EmailAlertsModule,
            markets_module_1.MarketsModule,
            trading_strategies_module_1.TradingStrategiesModule,
            shared_module_1.SharedModule,
            router_1.RouterModule.forChild(routes),
        ],
        declarations: [bot_details_component_1.BotDetailsComponent, _1.TabComponent, _1.TabsComponent]
    })
], ExchangeDetailsModule);
exports.ExchangeDetailsModule = ExchangeDetailsModule;
//# sourceMappingURL=bot-details.module.js.map