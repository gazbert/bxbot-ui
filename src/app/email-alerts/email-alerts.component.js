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
var email_alerts_1 = require("../model/email-alerts");
/**
 * Template-driven version of the Email Alerts config form.
 *
 * @author gazbert
 */
var EmailAlertsComponent = (function () {
    function EmailAlertsComponent(emailAlertsService, route, router) {
        this.emailAlertsService = emailAlertsService;
        this.route = route;
        this.router = router;
        this.active = true;
        this.formErrors = {};
        this.validationMessages = {
            'accountUsername': {
                'required': 'Account Username is required.',
                'maxlength': 'Account Username max length is 50 characters.',
                'pattern': 'Account Username must be alphanumeric and can only include the following special characters: _ -',
            },
            'password': {
                'required': 'Account Password is required.',
                'maxlength': 'Account Password max length is 50 characters.',
                'pattern': 'Account Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $',
                'validateEqual': 'Passwords must match.'
            },
            'confirmPassword': {
                'required': 'Please retype Account Password.',
                'maxlength': 'Account Password max length is 50 characters.',
                'pattern': 'Account Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $',
                'validateEqual': 'Passwords must match.'
            },
            'toAddress': {
                'required': 'To Address is required.',
                'maxlength': 'To Address max length is 50 characters.',
                'pattern': 'Valid email To Address is required, e.g. solo@falcon.com'
            },
            'fromAddress': {
                'required': 'From Address is required.',
                'maxlength': 'From Address max length is 50 characters.',
                'pattern': 'Valid email From Address is required, e.g. boba@hoth.com'
            }
        };
    }
    EmailAlertsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            _this.botId = params['id'];
            _this.emailAlertsService.getEmailAlertsConfigByBotId(_this.botId)
                .then(function (emailAlertsConfig) {
                _this.emailAlertsConfig = emailAlertsConfig;
                _this.updateFormErrors();
            });
        }).then(function () { });
    };
    EmailAlertsComponent.prototype.save = function (isValid) {
        var _this = this;
        if (isValid) {
            this.emailAlertsService.updateEmailAlertsConfig(this.emailAlertsConfig)
                .then(function (updatedConfig) {
                _this.emailAlertsConfig = updatedConfig;
                _this.goToDashboard();
            });
        }
        else {
            this.onValueChanged(); // force validation for new untouched strats
        }
    };
    EmailAlertsComponent.prototype.cancel = function () {
        this.goToDashboard();
    };
    EmailAlertsComponent.prototype.goToDashboard = function () {
        this.router.navigate(['dashboard']);
    };
    EmailAlertsComponent.prototype.updateFormErrors = function () {
        this.formErrors['accountUsername'] = '';
        this.formErrors['password'] = '';
        this.formErrors['confirmPassword'] = '';
        this.formErrors['toAddress'] = '';
        this.formErrors['fromAddress'] = '';
    };
    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------
    EmailAlertsComponent.prototype.ngAfterViewChecked = function () {
        this.formChanged();
    };
    EmailAlertsComponent.prototype.formChanged = function () {
        var _this = this;
        if (this.currentForm === this.emailAlertsForm) {
            return;
        }
        this.emailAlertsForm = this.currentForm;
        if (this.emailAlertsForm) {
            this.emailAlertsForm.valueChanges
                .subscribe(function (data) { return _this.onValueChanged(data); });
        }
    };
    EmailAlertsComponent.prototype.onValueChanged = function (data) {
        if (!this.emailAlertsForm) {
            return;
        }
        var form = this.emailAlertsForm.form;
        for (var field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                var control = form.get(field);
                // 1st condition validates user update to email config; 2nd condition validates untouched email config
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.emailAlertsForm.submitted)) {
                    var messages = this.validationMessages[field];
                    for (var key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    };
    return EmailAlertsComponent;
}());
__decorate([
    core_1.ViewChild('emailAlertsForm'),
    __metadata("design:type", forms_1.NgForm)
], EmailAlertsComponent.prototype, "currentForm", void 0);
EmailAlertsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-email-alerts',
        templateUrl: 'email-alerts.component.html',
        styleUrls: ['email-alerts.component.css']
    }),
    __metadata("design:paramtypes", [email_alerts_1.EmailAlertsHttpDataPromiseService, router_1.ActivatedRoute,
        router_1.Router])
], EmailAlertsComponent);
exports.EmailAlertsComponent = EmailAlertsComponent;
//# sourceMappingURL=email-alerts.component.js.map