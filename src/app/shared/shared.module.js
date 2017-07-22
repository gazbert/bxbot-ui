"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var title_case_pipe_1 = require("./title-case.pipe");
var duplicate_name_1 = require("./duplicate-name");
/**
 * Shared module to demo integrating shared components with rest of app.
 *
 * More useful stuff will be put in here eventually...
 *
 */
var SharedModule = (function () {
    function SharedModule() {
    }
    return SharedModule;
}());
SharedModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule],
        exports: [common_1.CommonModule, forms_1.FormsModule, title_case_pipe_1.TitleCasePipe, duplicate_name_1.DuplicateNameValidatorDirective],
        declarations: [title_case_pipe_1.TitleCasePipe, duplicate_name_1.DuplicateNameValidatorDirective]
    })
], SharedModule);
exports.SharedModule = SharedModule;
//# sourceMappingURL=shared.module.js.map