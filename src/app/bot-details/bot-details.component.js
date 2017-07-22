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
var bot_1 = require("../model/bot");
/**
 * Container for holding the Bot config and status screens.
 *
 * @author gazbert
 */
var BotDetailsComponent = (function () {
    function BotDetailsComponent(botDataService, route) {
        this.botDataService = botDataService;
        this.route = route;
        this.active = true;
    }
    BotDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var botId = params['id'];
            _this.botDataService.getBot(botId)
                .subscribe(function (bot) {
                _this.bot = bot;
            }, function (error) { return _this.errorMessage = error; }); // TODO - Show meaningful error to user?
        }).then(function () { });
    };
    return BotDetailsComponent;
}());
BotDetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-bot-details',
        templateUrl: 'bot-details.component.html',
        styleUrls: ['bot-details.component.css']
    }),
    __metadata("design:paramtypes", [bot_1.BotHttpDataObservableService, router_1.ActivatedRoute])
], BotDetailsComponent);
exports.BotDetailsComponent = BotDetailsComponent;
//# sourceMappingURL=bot-details.component.js.map