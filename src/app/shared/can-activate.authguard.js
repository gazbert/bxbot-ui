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
var authentication_service_1 = require("./authentication.service");
/**
 * FIXME - Broken - does not seem to get invoked and block the routes if the user is not logged in :-(
 */
var CanActivateAuthGuard = (function () {
    function CanActivateAuthGuard(authService, router) {
        this.authService = authService;
        this.router = router;
    }
    CanActivateAuthGuard.prototype.canActivate = function (route, state) {
        // stub for now
        return true;
        // if (AuthenticationService.isLoggedIn()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return false;
        // }
    };
    return CanActivateAuthGuard;
}());
CanActivateAuthGuard = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService, router_1.Router])
], CanActivateAuthGuard);
exports.CanActivateAuthGuard = CanActivateAuthGuard;
//# sourceMappingURL=can-activate.authguard.js.map