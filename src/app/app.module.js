"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var angular_in_memory_web_api_1 = require("angular-in-memory-web-api");
var model_1 = require("./model");
var bot_1 = require("./model/bot");
var exchange_adapter_1 = require("./model/exchange-adapter");
var promise_1 = require("./model/exchange-adapter/promise");
var market_1 = require("./model/market");
var dashboard_module_1 = require("./dashboard/dashboard.module");
var bot_details_module_1 = require("./bot-details/bot-details.module");
var exchange_adapter_module_1 = require("./exchange-adapter/exchange-adapter.module");
var email_alerts_module_1 = require("./email-alerts/email-alerts.module");
var app_routing_module_1 = require("./app-routing.module");
var email_alerts_1 = require("./model/email-alerts");
var trading_strategies_module_1 = require("./trading-strategies/trading-strategies.module");
var trading_strategy_http_data_promise_service_1 = require("./model/trading-strategy/trading-strategy-http-data-promise.service");
var login_module_1 = require("./login/login.module");
var shared_1 = require("./shared");
/**
 * BX-bot UI main module.
 *
 * @author gazbert
 */
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            http_1.HttpModule,
            // Comment line below out to use 'real' bxbot-ui-server Spring Boot backend
            angular_in_memory_web_api_1.InMemoryWebApiModule.forRoot(model_1.InMemoryDataService, { put204: false, delete404: true }),
            dashboard_module_1.DashboardModule,
            exchange_adapter_module_1.ExchangeAdapterModule,
            email_alerts_module_1.EmailAlertsModule,
            bot_details_module_1.ExchangeDetailsModule,
            trading_strategies_module_1.TradingStrategiesModule,
            app_routing_module_1.AppRoutingModule,
            login_module_1.LoginModule
        ],
        declarations: [
            app_component_1.AppComponent
        ],
        providers: [
            bot_1.BotHttpDataObservableService,
            promise_1.ExchangeAdapterHttpDataPromiseService,
            exchange_adapter_1.ExchangeAdapterHttpDataObservableService,
            market_1.MarketHttpDataPromiseService,
            trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService,
            email_alerts_1.EmailAlertsHttpDataPromiseService,
            shared_1.AuthenticationService,
            shared_1.CanActivateAuthGuard
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map