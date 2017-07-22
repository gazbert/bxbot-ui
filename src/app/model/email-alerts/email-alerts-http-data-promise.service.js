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
var http_1 = require("@angular/http");
var app_component_1 = require("../../app.component");
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
require("rxjs/add/operator/toPromise");
/**
 * HTTP implementation of the Email Alerts Data Service.
 *
 * It demonstrates use of Promises in call responses.
 *
 * We chain the toPromise operator to the Observable result of http.get. It converts the Observable into a Promise
 * which is passed back to the caller.
 *
 * Converting to a promise is a good choice when asking http.get to fetch a single chunk of data - when we receive the
 * data, we're done. A single result in the form of a promise is easy for the calling component to understand/consume.
 *
 * @author gazbert
 */
var EmailAlertsHttpDataPromiseService = EmailAlertsHttpDataPromiseService_1 = (function () {
    function EmailAlertsHttpDataPromiseService(http) {
        this.http = http;
        this.emailAlertsUrl = app_component_1.AppComponent.REST_API_BASE_URL + '/email_alerts';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    EmailAlertsHttpDataPromiseService.prototype.getEmailAlertsConfigByBotId = function (botId) {
        var url = this.emailAlertsUrl + '/' + botId;
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(EmailAlertsHttpDataPromiseService_1.handleError);
    };
    EmailAlertsHttpDataPromiseService.prototype.updateEmailAlertsConfig = function (emailAlertsConfig) {
        var url = this.emailAlertsUrl + '/' + emailAlertsConfig.id;
        return this.http
            .put(url, JSON.stringify(emailAlertsConfig), { headers: this.headers })
            .toPromise()
            .then(function (response) { return response.json().data; })
            .catch(EmailAlertsHttpDataPromiseService_1.handleError);
    };
    EmailAlertsHttpDataPromiseService.handleError = function (error) {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    };
    return EmailAlertsHttpDataPromiseService;
}());
EmailAlertsHttpDataPromiseService = EmailAlertsHttpDataPromiseService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], EmailAlertsHttpDataPromiseService);
exports.EmailAlertsHttpDataPromiseService = EmailAlertsHttpDataPromiseService;
var EmailAlertsHttpDataPromiseService_1;
//# sourceMappingURL=email-alerts-http-data-promise.service.js.map