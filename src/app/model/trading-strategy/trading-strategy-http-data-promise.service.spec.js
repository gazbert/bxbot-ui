"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var trading_strategy_http_data_promise_service_1 = require("./trading-strategy-http-data-promise.service");
var trading_strategy_1 = require("../trading-strategy");
/**
 * Tests the Trading Strategy HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('TradingStrategyHttpDataPromiseService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        }).compileComponents().then(function () { });
    }));
    it('should instantiate implementation of TradingStrategyDataService service when injected', testing_2.inject([trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService], function (service) {
        expect(service instanceof trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService(http);
        expect(service instanceof trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService).toBe(true, 'new service should be instance of TradingStrategyDataService');
    }));
    it('should provide the MockBackend as XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));
    describe('when getAllTradingStrategiesForBotId() operation called with \'btce\'', function () {
        var backend;
        var service;
        var fakeTradingStrategies;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService(http);
            fakeTradingStrategies = makeTradingStrategyData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeTradingStrategies } });
            response = new http_1.Response(options);
        }));
        it('should return 2 BTC-e Trading Strategies', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getAllTradingStrategiesForBotId(2)
                .then(function (tradingStrategies) { return expect(tradingStrategies.length).toBe(2, 'should return 2 BTC-e Trading Strategies'); });
        })));
        it('should handle returning no matching Trading Strategies', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getAllTradingStrategiesForBotId(100) // unknown id
                .then(function (tradingStrategies) { return expect(tradingStrategies.length).toBe(0, 'should have no Trading Strategies'); });
        })));
    });
    describe('when updateTradingStrategy() operation called for BTC-e', function () {
        var backend;
        var service;
        var response;
        var updatedTradingStrategy;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            updatedTradingStrategy = new trading_strategy_1.TradingStrategy('btce_macd_rsi', 2, 'MACD Indicator', 'MACD Indicator algo for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
            backend = be;
            service = new trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedTradingStrategy } });
            response = new http_1.Response(options);
        }));
        it('should return updated BTC-e Trading Strategy on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.updateTradingStrategy(updatedTradingStrategy)
                .then(function (tradingStrategy) {
                expect(tradingStrategy).toBe(updatedTradingStrategy);
                // paranoia!
                expect(tradingStrategy.id).toBe(updatedTradingStrategy.id);
                expect(tradingStrategy.name).toBe(updatedTradingStrategy.name);
                expect(tradingStrategy.className).toBe(updatedTradingStrategy.className);
            });
        })));
        it('should NOT return Market for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401, body: { data: ['Bad request - unknown id'] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.updateTradingStrategy(updatedTradingStrategy)
                .then(function (tradingStrategy) { return expect(tradingStrategy.id).not.toBeDefined('should have no Trading Strategy'); });
        })));
    });
    describe('when deleteTradingStrategyById() operation called with \'btce_macd_rsi\'', function () {
        var backend;
        var service;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new trading_strategy_http_data_promise_service_1.TradingStrategyHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200 });
            response = new http_1.Response(options);
        }));
        it('should return status response of \'true\' if successful', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.deleteTradingStrategyById('btce_macd_rsi')
                .then(function (status) { return expect(status).toBe(true); });
        })));
        it('should return status response of \'false\' if NOT successful', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.deleteTradingStrategyById('unknown')
                .then(function (status) { return expect(status).toBe(false); });
        })));
    });
});
var makeTradingStrategyData = function () { return [
    new trading_strategy_1.TradingStrategy('btce_macd_rsi', 2, 'MACD RSI Indicator', 'MACD Indicator and RSI algo for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdRsiStrategy'),
    new trading_strategy_1.TradingStrategy('btce_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')
]; };
//# sourceMappingURL=trading-strategy-http-data-promise.service.spec.js.map