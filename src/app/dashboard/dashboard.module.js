"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var dashboard_component_1 = require("./dashboard.component");
var dashboard_item_component_1 = require("./item/dashboard-item.component");
var platform_browser_1 = require("@angular/platform-browser");
var routes = [
    { path: 'dashboard', component: dashboard_component_1.DashboardComponent },
];
/**
 * The Dashboard module.
 * It provides the landing screen and Command & Control centre for the app.
 *
 * @author gazbert
 */
var DashboardModule = (function () {
    function DashboardModule() {
    }
    return DashboardModule;
}());
DashboardModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            router_1.RouterModule.forChild(routes)
        ],
        declarations: [dashboard_component_1.DashboardComponent, dashboard_item_component_1.DashboardItemComponent]
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;
//# sourceMappingURL=dashboard.module.js.map