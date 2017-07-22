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
var forms_1 = require("@angular/forms");
/**
 * Shared Directive component that checks for duplicate names.
 *
 * @author gazbert
 */
var DuplicateNameValidatorDirective = DuplicateNameValidatorDirective_1 = (function () {
    function DuplicateNameValidatorDirective() {
        this.validator = forms_1.Validators.nullValidator;
    }
    DuplicateNameValidatorDirective.prototype.ngOnChanges = function (changes) {
        var change = changes['duplicateName'];
        if (change) {
            // TODO - for some reason this is a ',' de-limited string instead of an array of string :-/
            var strategyNames = change.currentValue;
            var stratNameStringArray = strategyNames.split(',');
            this.validator = duplicateNameValidator(stratNameStringArray);
        }
        else {
            this.validator = forms_1.Validators.nullValidator;
        }
    };
    DuplicateNameValidatorDirective.prototype.validate = function (control) {
        return this.validator(control);
    };
    return DuplicateNameValidatorDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], DuplicateNameValidatorDirective.prototype, "duplicateName", void 0);
DuplicateNameValidatorDirective = DuplicateNameValidatorDirective_1 = __decorate([
    core_1.Directive({
        selector: '[duplicateName]',
        providers: [{ provide: forms_1.NG_VALIDATORS, useExisting: DuplicateNameValidatorDirective_1, multi: true }]
    })
], DuplicateNameValidatorDirective);
exports.DuplicateNameValidatorDirective = DuplicateNameValidatorDirective;
function duplicateNameValidator(strategyNames) {
    return function (control) {
        var inputName = control.value;
        var isDuplicate;
        for (var i = 0; i < strategyNames.length; i++) {
            var strategyName = strategyNames[i];
            if (strategyName === inputName) {
                isDuplicate = true;
                break;
            }
            else {
                isDuplicate = false;
            }
        }
        return isDuplicate ? { 'duplicateName': { name: name } } : null;
    };
}
exports.duplicateNameValidator = duplicateNameValidator;
var DuplicateNameValidatorDirective_1;
//# sourceMappingURL=duplicate-name.js.map