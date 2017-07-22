"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var exchange_adapter_http_data_promise_service_1 = require("./exchange-adapter-http-data-promise.service");
var exchange_adapter_model_1 = require("../exchange-adapter.model");
/**
 * Tests the Exchange Adapter HTTP Data service (Promise flavour) using a Mock HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeAdapterHttpDataPromiseService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        }).compileComponents().then(function () { });
    }));
    it('should instantiate implementation of ExchangeAdapterDataService when injected', testing_2.inject([exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService], function (service) {
        expect(service instanceof exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService(http);
        expect(service instanceof exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService).toBe(true, 'new service should be instance of ExchangeAdapterDataService');
    }));
    it('should provide MockBackend as replacement for XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend should be provided');
    }));
    describe('when getExchangeAdapters() operation called', function () {
        var backend;
        var service;
        var fakeExchangeAdapters;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, mockBackend) {
            backend = mockBackend;
            service = new exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeExchangeAdapters } });
            response = new http_1.Response(options);
        }));
        it('should return 3 Exchanges Adapters', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getExchangeAdapters()
                .then(function (exchangeAdapters) {
                expect(exchangeAdapters.length).toBe(fakeExchangeAdapters.length, 'should have returned 3 Exchange Adapters');
                // basic sanity check
                expect(exchangeAdapters[0].id).toBe('bitstamp');
                expect(exchangeAdapters[1].id).toBe('gdax');
                expect(exchangeAdapters[2].id).toBe('gemini');
            });
        })));
        it('should handle returning no Exchange Adapters', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapters()
                .then(function (exchangeAdapters) { return expect(exchangeAdapters.length).toBe(0, 'should have no Exchange Adapters'); });
        })));
    });
    describe('when getExchangeAdapterByBotId() operation called with \'2\'', function () {
        var backend;
        var service;
        var fakeExchangeAdapters;
        var response;
        var GDAX_EXCHANGE = 1;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, mockBackend) {
            backend = mockBackend;
            service = new exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeExchangeAdapters[GDAX_EXCHANGE] } });
            response = new http_1.Response(options);
        }));
        xit('should return GDAX Exchange Adapter', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getExchangeAdapterByBotId(2)
                .then(function (exchangeAdapter) {
                expect(exchangeAdapter.id).toBe('gdax');
                expect(exchangeAdapter.name).toBe('GDAX');
                expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
                expect(exchangeAdapter.botId).toBe(2);
                expect(exchangeAdapter.networkConfig.connectionTimeout).toBe(60);
                expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
                expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).toBe(503);
                expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBe(504);
                expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[2]).toBe(522);
                expect(exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);
                expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).toBe("Connection reset");
                expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe("Connection refused");
                expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[2]).toBe("Remote host closed connection during handshake");
            });
        })));
        xit('should handle returning no Bot Adapter', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapterByBotId(100) // unknown id
                .then(function (exchangeAdapter) { return expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter'); });
        })));
    });
    describe('when update() operation called for Bitstamp', function () {
        var backend;
        var service;
        var response;
        var updatedExchangeAdapter;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, mockBackend) {
            updatedExchangeAdapter = new exchange_adapter_model_1.ExchangeAdapter('bitstamp', 'Bitstamp v2', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2', 1, new exchange_adapter_model_1.NetworkConfig(90, [
                504,
                505,
                506,
            ], [
                "Connection reset again!",
                "Connection refused again!",
                "Remote host closed connection during handshake again!"
            ]));
            backend = mockBackend;
            service = new exchange_adapter_http_data_promise_service_1.ExchangeAdapterHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedExchangeAdapter } });
            response = new http_1.Response(options);
        }));
        it('should return updated Bitstamp Exchange Adapter on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.update(updatedExchangeAdapter)
                .then(function (exchangeAdapter) {
                expect(exchangeAdapter).toBe(updatedExchangeAdapter);
                // paranoia!
                expect(exchangeAdapter.id).toBe('bitstamp');
                expect(exchangeAdapter.name).toBe('Bitstamp v2');
                expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2');
            });
        })));
        it('should NOT return Bot Adapter for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401, body: { data: ['Bad request - unknown id'] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.update(updatedExchangeAdapter)
                .then(function (exchangeAdapter) { return expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter'); });
        })));
    });
});
var makeExchangeAdapterData = function () { return [
    new exchange_adapter_model_1.ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter', 1, new exchange_adapter_model_1.NetworkConfig(60, [
        501,
        502,
        503,
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
        504,
        505,
        522,
    ], [
        "Connection reset",
        "Connection refused",
        "Remote host closed connection during handshake"
    ]))
]; };
//# sourceMappingURL=exchange-adapter-http-data-promise.service.spec.js.map