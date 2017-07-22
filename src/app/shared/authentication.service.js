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
var Rx_1 = require("rxjs/Rx");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/observable/throw");
var app_component_1 = require("../app.component");
/**
 * Authentication service for authenticating with the backend server.
 * It initially logs in with basic auth and stores the returned JWT in local storage for
 * sending in the Authorization header for all subsequent requests.
 * <p>
 * Code originated from the excellent JWT + Angular tutorial by Rich Freeman:
 * http://chariotsolutions.com/blog/post/angular-2-spring-boot-jwt-cors_part2
 */
var AuthenticationService = AuthenticationService_1 = (function () {
    function AuthenticationService(http) {
        this.http = http;
        this.authUrl = app_component_1.AppComponent.AUTH_ENDPOINT_BASE_URL + '/auth';
        this.headers = new http_1.Headers({ 'Content-Type': 'application/json' });
    }
    AuthenticationService.prototype.login = function (username, password) {
        return this.http.post(this.authUrl, JSON.stringify({
            username: username,
            password: password
        }), { headers: this.headers })
            .map(function (response) {
            // login successful if there's a jwt token in the response
            var token = response.json() && response.json().token;
            if (token) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));
                return true;
            }
            else {
                return false;
            }
        }).catch(function (error) { return Rx_1.Observable.throw(error.json().error || 'Server error'); });
    };
    AuthenticationService.isLoggedIn = function () {
        var token = AuthenticationService_1.getToken();
        return token && token.length > 0;
    };
    AuthenticationService.getToken = function () {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        var token = currentUser && currentUser.token;
        return token ? token : "";
    };
    AuthenticationService.logout = function () {
        // clear token remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    };
    return AuthenticationService;
}());
AuthenticationService = AuthenticationService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
var AuthenticationService_1;
//# sourceMappingURL=authentication.service.js.map