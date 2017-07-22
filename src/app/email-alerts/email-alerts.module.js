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
var email_alerts_component_1 = require("./email-alerts.component");
var equal_validator_directive_1 = require("./equal-validator.directive");
/**
 * Encapsulates Email Alerts config management.
 *
 * @author gazbert
 */
var EmailAlertsModule = (function () {
    function EmailAlertsModule() {
    }
    return EmailAlertsModule;
}());
EmailAlertsModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule
        ],
        exports: [email_alerts_component_1.EmailAlertsComponent, equal_validator_directive_1.EqualValidator],
        declarations: [email_alerts_component_1.EmailAlertsComponent, equal_validator_directive_1.EqualValidator]
    })
], EmailAlertsModule);
exports.EmailAlertsModule = EmailAlertsModule;
//# sourceMappingURL=email-alerts.module.js.map