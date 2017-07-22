"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var login_1 = require("./login");
var shared_1 = require("./shared");
// import {SettingsComponent} from './settings.component';
/**
 * Main routing module for the app.
 *
 * @author gazbert
 */
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [
            router_1.RouterModule.forRoot([
                { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
                { path: 'dashboard', component: dashboard_component_1.DashboardComponent, canActivate: [shared_1.CanActivateAuthGuard] },
                { path: 'login', component: login_1.LoginComponent },
                { path: 'logout', component: login_1.LoginComponent },
                {
                    path: 'bot',
                    loadChildren: 'app/bot-details/bot-details.module#BotDetailsModule',
                    canActivate: [shared_1.CanActivateAuthGuard]
                }
            ])
        ],
        exports: [router_1.RouterModule] // re-export the module declarations
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map