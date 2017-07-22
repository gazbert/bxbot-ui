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
var bot_1 = require("../../model/bot");
/**
 * Represents a Dashboard Item component.
 * An item is a Bot.
 *
 * @author gazbert
 */
var DashboardItemComponent = (function () {
    function DashboardItemComponent() {
        this.selected = new core_1.EventEmitter();
    }
    DashboardItemComponent.prototype.click = function () {
        this.selected.next(this.bot);
    };
    return DashboardItemComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", bot_1.Bot)
], DashboardItemComponent.prototype, "bot", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], DashboardItemComponent.prototype, "selected", void 0);
DashboardItemComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-dashboard-item',
        templateUrl: 'dashboard-item.component.html',
        styleUrls: ['dashboard-item.component.css']
    })
], DashboardItemComponent);
exports.DashboardItemComponent = DashboardItemComponent;
//# sourceMappingURL=dashboard-item.component.js.map