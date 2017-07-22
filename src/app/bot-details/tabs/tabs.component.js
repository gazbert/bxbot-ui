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
var tab_component_1 = require("./tab.component");
/**
 * Presents a list of screen tabs - currently rendered as Bootstrap Pills.
 *
 * Originated from the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component
 */
var TabsComponent = (function () {
    function TabsComponent() {
    }
    // contentChildren are set
    TabsComponent.prototype.ngAfterContentInit = function () {
        // get all active tabs
        var activeTabs = this.tabs.filter(function (t) { return t.active; });
        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    };
    TabsComponent.prototype.selectTab = function (tab) {
        // deactivate all tabs
        this.tabs.toArray().forEach(function (t) { return t.active = false; });
        // activate the tab the user has clicked on.
        tab.active = true;
    };
    TabsComponent.prototype.trackByTabTitle = function (index, title) {
        return title;
    };
    return TabsComponent;
}());
__decorate([
    core_1.ContentChildren(tab_component_1.TabComponent),
    __metadata("design:type", core_1.QueryList)
], TabsComponent.prototype, "tabs", void 0);
TabsComponent = __decorate([
    core_1.Component({
        selector: 'tabs',
        template: "\n    <ul class=\"nav nav-pills\">\n      <li *ngFor=\"let tab of tabs; trackBy:trackByTabTitle\" (click)=\"selectTab(tab)\" [class.active]=\"tab.active\">            \n        <a href=\"bot/{{tab.id}}#\"><span>{{tab.title | titlecase}}</span></a>\n      </li>\n    </ul>\n    <ng-content></ng-content>\n  "
    })
], TabsComponent);
exports.TabsComponent = TabsComponent;
//# sourceMappingURL=tabs.component.js.map