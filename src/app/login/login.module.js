"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var login_component_1 = require("./login.component");
var forms_1 = require("@angular/forms");
var shared_module_1 = require("../shared/shared.module");
/**
 * The Login module.
 * It provides the login screen for the app.
 *
 * @author gazbert
 */
var LoginModule = (function () {
    function LoginModule() {
    }
    return LoginModule;
}());
LoginModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            shared_module_1.SharedModule
        ],
        exports: [login_component_1.LoginComponent],
        declarations: [login_component_1.LoginComponent]
    })
], LoginModule);
exports.LoginModule = LoginModule;
//# sourceMappingURL=login.module.js.map