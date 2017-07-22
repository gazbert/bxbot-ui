"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
/**
 * Simple shared pipe component to demo integrating with shared components with rest of app.
 * Transforms to uppercase the first letter of the words in a given string.
 *
 * TitleCasePipe taken from Angular tutorial material:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
var TitleCasePipe = (function () {
    function TitleCasePipe() {
    }
    TitleCasePipe.prototype.transform = function (input) {
        return input.length === 0 ? '' :
            input.replace(/\w\S*/g, (function (txt) { return txt[0].toUpperCase() + txt.substr(1).toLowerCase(); }));
    };
    return TitleCasePipe;
}());
TitleCasePipe = __decorate([
    core_1.Pipe({ name: 'titlecase', pure: false })
], TitleCasePipe);
exports.TitleCasePipe = TitleCasePipe;
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
//# sourceMappingURL=title-case.pipe.js.map