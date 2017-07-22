"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var bot_http_data_observable_service_1 = require("../bot-http-data-observable.service");
var bot_model_1 = require("../bot.model");
var Observable_1 = require("rxjs/Observable");
/**
 * Fake Bot data service (Observable flavour) backend for testing.
 *
 * Constructor is inherited from FakeBotDataObservableService - calling code should pass null when creating this object.
 * This seems very hacky.
 * Must be better way of doing this, but we have to inject concrete service classes into the components...
 *
 * @author gazbert
 */
var FakeBotDataObservableService = (function (_super) {
    __extends(FakeBotDataObservableService, _super);
    function FakeBotDataObservableService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.bots = exports.SOME_FAKE_OBSERVABLE_BOTS.map(function (e) { return e.clone(); });
        return _this;
    }
    FakeBotDataObservableService.prototype.getBots = function () {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            observer.next(_this.bots);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    FakeBotDataObservableService.prototype.getBot = function (id) {
        var bot = this.bots.find(function (e) { return e.id === id; });
        return Observable_1.Observable.create(function (observer) {
            observer.next(bot);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    FakeBotDataObservableService.prototype.getBotByName = function (name) {
        var bot = this.bots.find(function (e) { return e.name === name; });
        return Observable_1.Observable.create(function (observer) {
            observer.next(bot);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    FakeBotDataObservableService.prototype.update = function (bot) {
        return Observable_1.Observable.create(function (observer) {
            observer.next(bot);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    return FakeBotDataObservableService;
}(bot_http_data_observable_service_1.BotHttpDataObservableService));
exports.FakeBotDataObservableService = FakeBotDataObservableService;
exports.SOME_FAKE_OBSERVABLE_BOTS = [
    new bot_model_1.Bot(1, 'Bitstamp', 'Running'),
    new bot_model_1.Bot(2, 'GDAX', 'Running'),
    new bot_model_1.Bot(3, 'Gemini', 'Stopped')
];
//# sourceMappingURL=fake-bot-data-observable.service.js.map