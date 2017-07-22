"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var authentication_service_1 = require("./shared/authentication.service");
/**
 * The main app component.
 *
 * @author gazbert
 */
var AppComponent = AppComponent_1 = (function () {
    function AppComponent() {
    }
    AppComponent.prototype.isLoggedIn = function () {
        return authentication_service_1.AuthenticationService.isLoggedIn();
    };
    AppComponent.prototype.getTitle = function () {
        return AppComponent_1.TITLE;
    };
    return AppComponent;
}());
AppComponent.TITLE = 'BX-bot Admin Console';
/**
 * Base URL to real server's authentication endpoint.
 * This is ignored when using in-memory web API.
 */
AppComponent.AUTH_ENDPOINT_BASE_URL = 'http://localhost:8080';
/**
 * Base URL to real server's REST API endpoints.
 * Uncomment this to use the 'real' backend.
 */
// public static REST_API_BASE_URL = 'http://localhost:8080/api';
/**
 * Base URL to Angular's in-memory web API endpoints.
 * Uncomment this to use for dev/testing/demos.
 */
AppComponent.REST_API_BASE_URL = 'app';
AppComponent = AppComponent_1 = __decorate([
    core_1.Component({
        selector: 'bxbot-ui',
        template: "\n        <div class=\"container module-bootstrap\">\n            <h1>{{getTitle()}}</h1>\n            <nav>\n                <a id=\"dashboardButton\" routerLink=\"/dashboard\" routerLinkActive=\"active\">Dashboard</a>\n                <a id=\"settingsButton\">Settings</a>\n                <a id=\"logoutButton\" class=\"logout-btn\" routerLink=\"/login\" routerLinkActive=\"active\"\n                   *ngIf=\"isLoggedIn()\">Logout</a>\n            </nav>\n            <router-outlet></router-outlet>\n        </div>"
    })
], AppComponent);
exports.AppComponent = AppComponent;
var AppComponent_1;
//# sourceMappingURL=app.component.js.map