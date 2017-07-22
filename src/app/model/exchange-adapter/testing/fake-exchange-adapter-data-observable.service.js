"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Observable_1 = require("rxjs/Observable");
var exchange_adapter_model_1 = require("../exchange-adapter.model");
var exchange_adapter_http_data_observable_service_1 = require("../exchange-adapter-http-data-observable.service");
/**
 * Fake Exchange Adapter data service (Observable flavour) backend for testing.
 *
 * @author gazbert
 */
var FakeExchangeAdapterDataObservableService = (function (_super) {
    __extends(FakeExchangeAdapterDataObservableService, _super);
    function FakeExchangeAdapterDataObservableService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.exchangeAdapters = exports.SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS.map(function (e) { return e.clone(); });
        return _this;
    }
    FakeExchangeAdapterDataObservableService.prototype.getExchangeAdapters = function () {
        var _this = this;
        return Observable_1.Observable.create(function (observer) {
            observer.next(_this.exchangeAdapters);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    FakeExchangeAdapterDataObservableService.prototype.getExchangeAdapterByBotId = function (id) {
        var exchangeAdapter = this.exchangeAdapters.find(function (e) { return e.botId === id; });
        return Observable_1.Observable.create(function (observer) {
            observer.next(exchangeAdapter);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    FakeExchangeAdapterDataObservableService.prototype.update = function (exchangeAdapter) {
        return Observable_1.Observable.create(function (observer) {
            observer.next(exchangeAdapter);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    };
    return FakeExchangeAdapterDataObservableService;
}(exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService));
exports.FakeExchangeAdapterDataObservableService = FakeExchangeAdapterDataObservableService;
exports.SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS = [
    new exchange_adapter_model_1.ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter', 1, new exchange_adapter_model_1.NetworkConfig(60, [
        503,
        504,
        522,
    ], [
        "Connection reset",
        "Connection refused",
        "Remote host closed connection during handshake"
    ])),
    new exchange_adapter_model_1.ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter', 2, new exchange_adapter_model_1.NetworkConfig(60, [
        503,
        504,
        522,
    ], [
        "Connection reset",
        "Connection refused",
        "Remote host closed connection during handshake"
    ])),
    new exchange_adapter_model_1.ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter', 3, new exchange_adapter_model_1.NetworkConfig(60, [
        503,
        504,
        522,
    ], [
        "Connection reset",
        "Connection refused",
        "Remote host closed connection during handshake"
    ]))
];
//# sourceMappingURL=fake-exchange-adapter-data-observable.service.js.map