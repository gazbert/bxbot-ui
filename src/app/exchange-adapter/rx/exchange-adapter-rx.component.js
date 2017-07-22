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
var exchange_adapter_1 = require("../../model/exchange-adapter");
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
require("rxjs/add/operator/map");
/**
 * Reactive (RxJS) version of the Exchange Adapter form.
 * See: https://angular.io/docs/ts/latest/guide/reactive-forms.html
 *
 * I'm still not convinced the Reactive form approach is better than the (far) simpler Template form approach -
 * there's so much more code to write... or am I being a noob and missing something here? ;-/
 *
 * For demo purposes, it uses the Observable implementation of the Exchange Adapter HTTP Data service.
 *
 * @author gazbert
 */
var ExchangeAdapterRxComponent = (function () {
    function ExchangeAdapterRxComponent(exchangeAdapterDataService, route, fb, router) {
        this.exchangeAdapterDataService = exchangeAdapterDataService;
        this.route = route;
        this.fb = fb;
        this.router = router;
        this.active = true;
        this.formSaved = false;
        this.formErrors = {
            'adapterName': '',
            'className': '',
            'connectionTimeout': '',
            'nonFatalErrorHttpStatusCodes': '',
            'nonFatalErrorMessages': ''
        };
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
            'nonFatalErrorHttpStatusCodes': {
                'required': 'Connection timeout is required.',
                'pattern': 'HTTP Status Code must be a 3 digit number.',
                'httpCodeWhitelistChecker': 'HTTP Status Code not in whitelist.'
            },
            'nonFatalErrorMessages': {
                'required': 'Message must not be empty.',
                'maxlength': 'Message length cannot be more than 120 characters long.'
            }
        };
    }
    ExchangeAdapterRxComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var botId = params['id'];
            _this.exchangeAdapterDataService.getExchangeAdapterByBotId(botId)
                .subscribe(function (exchangeAdapter) {
                _this.exchangeAdapter = exchangeAdapter;
                _this.buildForm();
            }, function (error) { return _this.errorMessage = error; }); // TODO - Show meaningful error to user?
        }).then(function () { });
    };
    ExchangeAdapterRxComponent.prototype.goToDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    ExchangeAdapterRxComponent.prototype.save = function (isValid) {
        var _this = this;
        this.formSaved = true;
        if (isValid) {
            // TODO - Must be better way to adapt domain model <-> form UI model?
            this.exchangeAdapter.id = this.exchangeAdapterForm.get('botId').value;
            this.exchangeAdapter.name = this.exchangeAdapterForm.get('adapterName').value;
            this.exchangeAdapter.className = this.exchangeAdapterForm.get('className').value;
            this.exchangeAdapter.networkConfig.connectionTimeout = this.exchangeAdapterForm.get('connectionTimeout').value;
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length = 0;
            this.exchangeAdapterForm.get('nonFatalErrorHttpStatusCodes').value.forEach(function (c) { return _this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(parseInt(c, 10)); });
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length = 0;
            this.exchangeAdapterForm.get('nonFatalErrorMessages').value.forEach(function (m) { return _this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push(m); });
            this.exchangeAdapterDataService.update(this.exchangeAdapter)
                .subscribe(function () { return _this.goToDashboard(); }, function (error) { return _this.errorMessage = error; }); // TODO - Show meaningful error to user?
        }
    };
    ExchangeAdapterRxComponent.prototype.cancel = function () {
        this.goToDashboard();
    };
    ExchangeAdapterRxComponent.prototype.isFormSaved = function () {
        return this.formSaved;
    };
    ExchangeAdapterRxComponent.prototype.addErrorCode = function () {
        var control = this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.push(this.createErrorCodeGroup(null));
    };
    ExchangeAdapterRxComponent.prototype.deleteErrorCode = function (i) {
        var control = this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        control.removeAt(i);
    };
    ExchangeAdapterRxComponent.prototype.addErrorMessage = function () {
        var control = this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        control.push(this.createErrorMessageGroup(''));
    };
    ExchangeAdapterRxComponent.prototype.deleteErrorMessage = function (i) {
        var control = this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        control.removeAt(i);
    };
    // ------------------------------------------------------------------
    // Form validation stuff
    // ------------------------------------------------------------------
    ExchangeAdapterRxComponent.prototype.buildForm = function () {
        var _this = this;
        this.exchangeAdapterForm = this.fb.group({
            botId: new forms_1.FormControl({ value: this.exchangeAdapter.id, disabled: true }, forms_1.Validators.required),
            adapterName: [this.exchangeAdapter.name, [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(1),
                    forms_1.Validators.maxLength(50),
                    forms_1.Validators.pattern('[a-zA-Z0-9_\\- ]*')
                ]],
            className: [this.exchangeAdapter.className, [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(1),
                    forms_1.Validators.maxLength(120),
                    forms_1.Validators.pattern('([a-zA-Z_$][a-zA-Z0-9_$]*\.)*[a-zA-Z_$][a-zA-Z0-9_$]*')
                ]],
            connectionTimeout: [this.exchangeAdapter.networkConfig.connectionTimeout, [
                    forms_1.Validators.required,
                    forms_1.Validators.pattern('\\d+')
                ]],
            nonFatalErrorHttpStatusCodes: new forms_1.FormArray([]),
            nonFatalErrorMessages: new forms_1.FormArray([]),
        });
        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.forEach(function (code) { return _this.nonFatalErrorHttpStatusCodes.push(_this.createErrorCodeGroup(code)); });
        // TODO - Must be better way to automatically init the arrays from the model?
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.forEach(function (msg) { return _this.nonFatalErrorMessages.push(_this.createErrorMessageGroup(msg)); });
        this.exchangeAdapterForm.valueChanges.subscribe(function (data) { return _this.onValueChanged(data); });
        this.onValueChanged(); // (re)set validation messages now
    };
    ExchangeAdapterRxComponent.prototype.createErrorMessageGroup = function (errorMsg) {
        return new forms_1.FormControl(errorMsg, [
            forms_1.Validators.required,
            forms_1.Validators.minLength(1),
            forms_1.Validators.maxLength(120),
        ]);
    };
    ExchangeAdapterRxComponent.prototype.createErrorCodeGroup = function (code) {
        return new forms_1.FormControl(code, [
            forms_1.Validators.required,
            forms_1.Validators.pattern('\\d{3}'),
            this.httpCodeWhitelistChecker,
        ]);
    };
    Object.defineProperty(ExchangeAdapterRxComponent.prototype, "nonFatalErrorHttpStatusCodes", {
        get: function () {
            return this.exchangeAdapterForm.get('nonFatalErrorHttpStatusCodes');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ExchangeAdapterRxComponent.prototype, "nonFatalErrorMessages", {
        get: function () {
            return this.exchangeAdapterForm.get('nonFatalErrorMessages');
        },
        enumerable: true,
        configurable: true
    });
    ExchangeAdapterRxComponent.prototype.onValueChanged = function (data) {
        var _this = this;
        if (!this.exchangeAdapterForm) {
            return;
        }
        var form = this.exchangeAdapterForm;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                if (control && control.dirty && !control.valid) {
                    var messages = this.validationMessages[field];
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
        // Set errors for any invalid Error Codes
        var errorCodeControl = this.exchangeAdapterForm.controls['nonFatalErrorHttpStatusCodes'];
        errorCodeControl.controls.forEach(function (code) {
            if (code && !code.valid) {
                _this.formErrors['nonFatalErrorHttpStatusCodes'] = '';
                var messages = _this.validationMessages['nonFatalErrorHttpStatusCodes'];
                for (var key in code.errors) {
                    if (code.errors.hasOwnProperty(key)) {
                        _this.formErrors['nonFatalErrorHttpStatusCodes'] += messages[key] + ' ';
                    }
                }
            }
        });
        // Set errors for any invalid Error Messages
        var errorMessageControl = this.exchangeAdapterForm.controls['nonFatalErrorMessages'];
        errorMessageControl.controls.forEach(function (msg) {
            if (msg && !msg.valid) {
                _this.formErrors['nonFatalErrorMessages'] = '';
                var messages = _this.validationMessages['nonFatalErrorMessages'];
                for (var key in msg.errors) {
                    if (msg.errors.hasOwnProperty(key)) {
                        _this.formErrors['nonFatalErrorMessages'] += messages[key] + ' ';
                    }
                }
            }
        });
        // reset so we don't error new (empty) errorCode/errorMsg before user gets chance to save
        if (form.valid) {
            this.formSaved = false;
        }
    };
    /**
     * Here for demo purposes only. Shows how to use custom validation in a Reactive form.
     */
    ExchangeAdapterRxComponent.prototype.httpCodeWhitelistChecker = function (control) {
        // TODO - Get from config or someplace else...
        var httpCodeWhitelist = ['501', '502', '503', '504', '524', '525', '522'];
        if (control && control.dirty) {
            var httpStatusCode_1 = control.value;
            var validCode = httpCodeWhitelist.some(function (code) {
                return code === httpStatusCode_1;
            });
            return validCode ? null : { 'httpCodeWhitelistChecker': { httpStatusCode: httpStatusCode_1 } };
        }
        else {
            return null;
        }
    };
    return ExchangeAdapterRxComponent;
}());
ExchangeAdapterRxComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-exchange-adapter-rx',
        templateUrl: 'exchange-adapter-rx.component.html',
        styleUrls: ['exchange-adapter-rx.component.css']
    }),
    __metadata("design:paramtypes", [exchange_adapter_1.ExchangeAdapterHttpDataObservableService, router_1.ActivatedRoute,
        forms_1.FormBuilder, router_1.Router])
], ExchangeAdapterRxComponent);
exports.ExchangeAdapterRxComponent = ExchangeAdapterRxComponent;
//# sourceMappingURL=exchange-adapter-rx.component.js.map