"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var market_http_data_promise_service_1 = require("./market-http-data-promise.service");
var trading_strategy_1 = require("../trading-strategy");
var market_model_1 = require("./market.model");
/**
 * Tests the Market HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('MarketHttpDataPromiseService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                market_http_data_promise_service_1.MarketHttpDataPromiseService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        }).compileComponents().then(function () { });
    }));
    it('should instantiate implementation of MarketDataService when injected', testing_2.inject([market_http_data_promise_service_1.MarketHttpDataPromiseService], function (service) {
        expect(service instanceof market_http_data_promise_service_1.MarketHttpDataPromiseService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new market_http_data_promise_service_1.MarketHttpDataPromiseService(http);
        expect(service instanceof market_http_data_promise_service_1.MarketHttpDataPromiseService).toBe(true, 'new service should be instance of MarketDataService');
    }));
    it('should provide the MockBackend as XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));
    describe('when getAllMarketsForBotId() operation called with \'btce\'', function () {
        var backend;
        var service;
        var fakeMarkets;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new market_http_data_promise_service_1.MarketHttpDataPromiseService(http);
            fakeMarkets = makeMarketData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeMarkets } });
            response = new http_1.Response(options);
        }));
        it('should return 2 BTC-e Markets', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getAllMarketsForBotId(3)
                .then(function (markets) {
                expect(markets.length).toBe(2, 'should return 2 BTC-e Markets');
                // basic sanity check
                expect(markets[0].id).toBe('btce_btc_usd');
                expect(markets[1].id).toBe('btce_ltc_usd');
            });
        })));
        it('should handle returning no matching Markets', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getAllMarketsForBotId(100) // unknown id
                .then(function (markets) { return expect(markets.length).toBe(0, 'should have no Markets'); });
        })));
    });
    describe('when updateMarket() operation called for BTC-e', function () {
        var backend;
        var service;
        var response;
        var updatedMarket;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            updatedMarket = new market_model_1.Market('btce_btc_usd', 3, 'BTC/USD', true, 'BTC', 'USD', new trading_strategy_1.TradingStrategy('btce_macd', 3, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy'));
            backend = be;
            service = new market_http_data_promise_service_1.MarketHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedMarket } });
            response = new http_1.Response(options);
        }));
        it('should return updated BTC-e Market on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.updateMarket(updatedMarket)
                .then(function (market) {
                expect(market).toBe(updatedMarket);
                // paranoia!
                expect(market.tradingStrategy.id).toBe(updatedMarket.tradingStrategy.id);
                expect(market.tradingStrategy.name).toBe(updatedMarket.tradingStrategy.name);
                expect(market.tradingStrategy.className).toBe(updatedMarket.tradingStrategy.className);
            });
        })));
        it('should NOT return Market for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401, body: { data: ['Bad request - unknown id'] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.updateMarket(updatedMarket)
                .then(function (market) { return expect(market.id).not.toBeDefined('should have no Market'); });
        })));
    });
    describe('when deleteMarketById() operation called with \'btce_btc_usd\'', function () {
        var backend;
        var service;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new market_http_data_promise_service_1.MarketHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200 });
            response = new http_1.Response(options);
        }));
        it('should return status response of \'true\' if successful', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.deleteMarketById('btce_btc_usd')
                .then(function (status) { return expect(status).toBe(true); });
        })));
        it('should return status response of \'false\' if NOT successful', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.deleteMarketById('unknown')
                .then(function (status) { return expect(status).toBe(false); });
        })));
    });
});
var makeMarketData = function () { return [
    new market_model_1.Market('btce_btc_usd', 3, 'BTC/USD', true, 'BTC', 'USD', new trading_strategy_1.TradingStrategy('btce_macd_rsi', 3, 'MACD RSI Indicator', 'MACD Indicator and RSI algo for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdRsiStrategy')),
    new market_model_1.Market('btce_ltc_usd', 3, 'LTC/USD', true, 'LTC', 'USD', new trading_strategy_1.TradingStrategy('btce_macd', 3, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')),
]; };
//# sourceMappingURL=market-http-data-promise.service.spec.js.map