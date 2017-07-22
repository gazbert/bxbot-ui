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
var router_1 = require("@angular/router");
var forms_1 = require("@angular/forms");
var promise_1 = require("../model/exchange-adapter/promise");
/**
 * Template-driven version of the Exchange Adapter form.
 *
 * @author gazbert
 */
var ExchangeAdapterComponent = (function () {
    function ExchangeAdapterComponent(exchangeAdapterDataService, route, router) {
        this.exchangeAdapterDataService = exchangeAdapterDataService;
        this.route = route;
        this.router = router;
        this.active = true;
        this.formErrors = {};
        this.validationMessages = {
            'adapterName': {
                'required': 'Name is required.',
                'maxlength': 'Name max length is 50 characters.',
                'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
            },
            'className': {
                'required': 'Class Name is required.',
                'maxlength': 'Class Name max length is 120 characters.',
                'pattern': 'Class Name must be valid Java class, e.g. com.my.MyExchangeAdapterClass'
            },
            'connectionTimeout': {
                'required': 'Connection timeout is required.',
                'pattern': 'Connection timeout must be a whole number.'
            },
            'errorCode': {
                'required': 'Connection timeout is required.',
                'pattern': 'HTTP Status Code must be a 3 digit number.'
            },
            'errorMessage': {
                'required': 'Error message must not be empty.'
            }
        };
    }
    ExchangeAdapterComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var botId = params['id'];
            _this.exchangeAdapterDataService.getExchangeAdapterByBotId(botId)
                .then(function (exchangeAdapter) {
                _this.exchangeAdapter = exchangeAdapter;
                _this.updateFormErrors();
            });
        }).then(function () { });
    };
    ExchangeAdapterComponent.prototype.goToDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    ExchangeAdapterComponent.prototype.cancel = function () {
        this.goToDashboard();
    };
    ExchangeAdapterComponent.prototype.save = function (isValid) {
        var _this = this;
        if (isValid) {
            this.exchangeAdapterDataService.update(this.exchangeAdapter)
                .then(function () { return _this.goToDashboard(); });
        }
        else {
            this.onValueChanged(); // force validation for new untouched error codes/messages
        }
    };
    ExchangeAdapterComponent.prototype.addErrorCode = function () {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(null);
        this.updateFormErrors();
    };
    ExchangeAdapterComponent.prototype.deleteErrorCode = function (code) {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.filter(function (c) { return c !== code; });
        this.updateFormErrors();
    };
    ExchangeAdapterComponent.prototype.addErrorMessage = function (message) {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push(message);
        this.updateFormErrors();
    };
    ExchangeAdapterComponent.prototype.deleteErrorMessage = function (message) {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages =
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.filter(function (m) { return m !== message; });
        this.updateFormErrors();
    };
    ExchangeAdapterComponent.prototype.updateFormErrors = function () {
        this.formErrors['adapterName'] = '';
        this.formErrors['className'] = '';
        this.formErrors['connectionTimeout'] = '';
        for (var i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length; i++) {
            this.formErrors['errorCode_' + i] = '';
        }
        for (var i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length; i++) {
            this.formErrors['errorMessage_' + i] = '';
        }
    };
    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------
    ExchangeAdapterComponent.prototype.ngAfterViewChecked = function () {
        this.formChanged();
    };
    ExchangeAdapterComponent.prototype.formChanged = function () {
        var _this = this;
        if (this.currentForm === this.exchangeAdapterForm) {
            return;
        }
        this.exchangeAdapterForm = this.currentForm;
        if (this.exchangeAdapterForm) {
            this.exchangeAdapterForm.valueChanges
                .subscribe(function (data) { return _this.onValueChanged(data); });
        }
    };
    ExchangeAdapterComponent.prototype.onValueChanged = function (data) {
        if (!this.exchangeAdapterForm) {
            return;
        }
        var form = this.exchangeAdapterForm.form;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.exchangeAdapterForm.submitted)) {
                    var messages = void 0;
                    if (field.indexOf('_') === -1) {
                        messages = this.validationMessages[field];
                    }
                    else {
                        // for multiple error codes and messages
                        messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
                    }
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    };
    return ExchangeAdapterComponent;
}());
__decorate([
    core_1.ViewChild('exchangeAdapterForm'),
    __metadata("design:type", forms_1.NgForm)
], ExchangeAdapterComponent.prototype, "currentForm", void 0);
ExchangeAdapterComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-exchange-adapter',
        templateUrl: 'exchange-adapter.component.html',
        styleUrls: ['exchange-adapter.component.css']
    }),
    __metadata("design:paramtypes", [promise_1.ExchangeAdapterHttpDataPromiseService, router_1.ActivatedRoute,
        router_1.Router])
], ExchangeAdapterComponent);
exports.ExchangeAdapterComponent = ExchangeAdapterComponent;
//# sourceMappingURL=exchange-adapter.component.js.map