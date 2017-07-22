"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var exchange_adapter_model_1 = require("../exchange-adapter.model");
var promise_1 = require("../../exchange-adapter/promise");
/**
 * Fake Exchange Adapter data service (Promise flavour) backend for testing.
 *
 * @author gazbert
 */
var FakeExchangeAdapterDataPromiseService = (function (_super) {
    __extends(FakeExchangeAdapterDataPromiseService, _super);
    function FakeExchangeAdapterDataPromiseService() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.exchangeAdapters = exports.SOME_FAKE_PROMISE_EXCHANGE_ADAPTERS.map(function (e) { return e.clone(); });
        return _this;
    }
    FakeExchangeAdapterDataPromiseService.prototype.getExchangeAdapters = function () {
        return this.lastPromise = Promise.resolve(this.exchangeAdapters);
    };
    FakeExchangeAdapterDataPromiseService.prototype.getExchangeAdapterByBotId = function (id) {
        var exchangeAdapter = this.exchangeAdapters.find(function (e) { return e.botId === id; });
        return this.lastPromise = Promise.resolve(exchangeAdapter);
    };
    FakeExchangeAdapterDataPromiseService.prototype.update = function (exchangeAdapter) {
        return this.lastPromise = this.getExchangeAdapterByBotId(exchangeAdapter.botId).then(function (e) {
            return e ?
                Object.assign(e, exchangeAdapter) :
                Promise.reject("Exchange Adapter " + exchangeAdapter.id + " not found");
        });
    };
    return FakeExchangeAdapterDataPromiseService;
}(promise_1.ExchangeAdapterHttpDataPromiseService));
exports.FakeExchangeAdapterDataPromiseService = FakeExchangeAdapterDataPromiseService;
exports.SOME_FAKE_PROMISE_EXCHANGE_ADAPTERS = [
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
//# sourceMappingURL=fake-exchange-adapter-data-promise.service.js.map