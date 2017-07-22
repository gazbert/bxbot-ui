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
/**
 * Represents a single screen tab.
 *
 * Originated from the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/
 */
var TabComponent = (function () {
    function TabComponent() {
        this.active = false;
    }
    return TabComponent;
}());
__decorate([
    core_1.Input('tabTitle'),
    __metadata("design:type", String)
], TabComponent.prototype, "title", void 0);
__decorate([
    core_1.Input('tabId'),
    __metadata("design:type", String)
], TabComponent.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TabComponent.prototype, "active", void 0);
TabComponent = __decorate([
    core_1.Component({
        selector: 'tab',
        styles: ["\n    .pane{\n      padding: 1em;\n    }\n  "],
        template: "\n    <div [hidden]=\"!active\" class=\"pane\">\n      <ng-content></ng-content>\n    </div>\n  "
    })
], TabComponent);
exports.TabComponent = TabComponent;
//# sourceMappingURL=tab.component.js.map