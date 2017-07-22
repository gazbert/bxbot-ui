"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var exchange_adapter_rx_component_1 = require("./rx/exchange-adapter-rx.component");
var forms_1 = require("@angular/forms");
var exchange_adapter_component_1 = require("./exchange-adapter.component");
/**
 * Encapsulates Exchange Adapter config management.
 *
 * @author gazbert
 */
var ExchangeAdapterModule = (function () {
    function ExchangeAdapterModule() {
    }
    return ExchangeAdapterModule;
}());
ExchangeAdapterModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule
        ],
        exports: [exchange_adapter_rx_component_1.ExchangeAdapterRxComponent, exchange_adapter_component_1.ExchangeAdapterComponent],
        declarations: [exchange_adapter_rx_component_1.ExchangeAdapterRxComponent, exchange_adapter_component_1.ExchangeAdapterComponent]
    })
], ExchangeAdapterModule);
exports.ExchangeAdapterModule = ExchangeAdapterModule;
//# sourceMappingURL=exchange-adapter.module.js.map