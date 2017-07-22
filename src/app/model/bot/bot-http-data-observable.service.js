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
var shared_1 = require("../../shared");
var Observable_1 = require("rxjs/Observable");
var isObject_1 = require("rxjs/util/isObject");
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/operator/toPromise");
/**
 * HTTP implementation of the Bot Data Service.
 *
 * It demonstrates use of Observables in call responses.
 *
 * An Observable is a stream of events that can be processed with array-like operators.
 * Angular uses the RxJS library to provide basic support for Observables.
 *
 * Observables are useful if you start a request, cancel it, and then make a different request before the server has
 * responded to the first request. This request-cancel-new-request sequence is difficult to implement with Promises.
 *
 * @author gazbert
 */
var BotHttpDataObservableService = BotHttpDataObservableService_1 = (function () {
    function BotHttpDataObservableService(http) {
        this.http = http;
        this.botUrl = app_component_1.AppComponent.REST_API_BASE_URL + '/bots';
    }
    BotHttpDataObservableService.prototype.getBots = function () {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + shared_1.AuthenticationService.getToken()
        });
        return this.http.get(this.botUrl, { headers: headers })
            .map(BotHttpDataObservableService_1.extractData)
            .catch(BotHttpDataObservableService_1.handleError);
    };
    BotHttpDataObservableService.prototype.getBot = function (id) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + shared_1.AuthenticationService.getToken()
        });
        return this.http
            .get(this.botUrl + '/' + id, { headers: headers })
            .map(function (r) { return r.json().data; })
            .catch(BotHttpDataObservableService_1.handleError);
    };
    BotHttpDataObservableService.prototype.getBotByName = function (name) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + shared_1.AuthenticationService.getToken()
        });
        return this.http
            .get(this.botUrl + '/?name=' + name, { headers: headers })
            .map(BotHttpDataObservableService_1.extractData)
            .catch(BotHttpDataObservableService_1.handleError);
    };
    BotHttpDataObservableService.prototype.update = function (bot) {
        var headers = new http_1.Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + shared_1.AuthenticationService.getToken()
        });
        var url = this.botUrl + "/" + bot.id;
        var body = JSON.stringify(bot);
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.put(url, body, options)
            .map(BotHttpDataObservableService_1.extractData)
            .catch(BotHttpDataObservableService_1.handleError);
    };
    BotHttpDataObservableService.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // Redirect to friendly error page?
        var errMsg = (error.message) ? error.message :
            error.status ? error.status + " - " + error.statusText : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable_1.Observable.throw(errMsg);
    };
    BotHttpDataObservableService.extractData = function (res) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        var body = res.json();
        if (isObject_1.isObject(body)) {
            return body.data || {};
        }
        else {
            return {};
        }
    };
    return BotHttpDataObservableService;
}());
BotHttpDataObservableService = BotHttpDataObservableService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], BotHttpDataObservableService);
exports.BotHttpDataObservableService = BotHttpDataObservableService;
var BotHttpDataObservableService_1;
//# sourceMappingURL=bot-http-data-observable.service.js.map