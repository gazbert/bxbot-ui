"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var exchange_adapter_http_data_observable_service_1 = require("./exchange-adapter-http-data-observable.service");
var exchange_adapter_model_1 = require("./exchange-adapter.model");
var Observable_1 = require("rxjs/Observable");
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
require("rxjs/add/observable/throw");
require("rxjs/add/operator/do");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
/**
 * Tests the Exchange Adapter HTTP Data service (Observable flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeAdapterHttpDataObservableService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        })
            .compileComponents().then(function () { });
    }));
    it('should instantiate implementation of ExchangeAdapterDataService when injected', testing_2.inject([exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService], function (service) {
        expect(service instanceof exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService(http);
        expect(service instanceof exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService).toBe(true, 'new service should be instance of ExchangeAdapterDataService');
    }));
    it('should provide MockBackend as replacement for XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));
    describe('when getExchangeAdapters() operation called', function () {
        var backend;
        var service;
        var fakeExchangeAdapters;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeExchangeAdapters } });
            response = new http_1.Response(options);
        }));
        it('should return 3 Exchange Adapters ', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getExchangeAdapters()
                .subscribe(function (exchangeAdapters) {
                expect(exchangeAdapters.length).toBe(fakeExchangeAdapters.length, 'should have returned 3 Exchange Adapters');
                // basic sanity check
                expect(exchangeAdapters[0].id).toBe('bitstamp');
                expect(exchangeAdapters[1].id).toBe('gdax');
                expect(exchangeAdapters[2].id).toBe('gemini');
            });
            //.toPromise();
        })));
        it('should handle returning no Exchange Adapters', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapters()
                .subscribe(function (exchangeAdapters) { return expect(exchangeAdapters.length).toBe(0, 'should have no Exchange Adapters'); });
            //.toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapters()
                .do(function () {
                fail('should not respond with Exchange Adapters');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
    describe('when getExchangeAdapterByBotId() operation called with \'2\'', function () {
        var backend;
        var service;
        var fakeExchangeAdapters;
        var response;
        var GDAX_EXCHANGE = 1;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeExchangeAdapters[GDAX_EXCHANGE] } });
            response = new http_1.Response(options);
        }));
        it('should return GDAX Exchange Adapter', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getExchangeAdapterByBotId(2)
                .subscribe(function (exchangeAdapter) {
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
            //.toPromise();
        })));
        it('should handle returning no Exchange Adapter', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapterByBotId(100) // unknown id
                .subscribe(function (exchangeAdapter) { return expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter'); });
            //.toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getExchangeAdapterByBotId(100) // unknown id
                .do(function () {
                fail('should not respond with Exchange Adapter');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
    describe('when update() operation called for Bitstamp', function () {
        var backend;
        var service;
        var response;
        var updatedExchangeAdapter;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            updatedExchangeAdapter = new exchange_adapter_model_1.ExchangeAdapter('bitstamp', 'Bitstamp v2', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2', 1, new exchange_adapter_model_1.NetworkConfig(90, [
                504,
                505,
                506,
            ], [
                "Connection reset again!",
                "Connection refused again!",
                "Remote host closed connection during handshake again!"
            ]));
            backend = be;
            service = new exchange_adapter_http_data_observable_service_1.ExchangeAdapterHttpDataObservableService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedExchangeAdapter } });
            response = new http_1.Response(options);
        }));
        it('should return updated Bitstamp Exchange Adapter on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.update(updatedExchangeAdapter)
                .subscribe(function (exchangeAdapter) {
                expect(exchangeAdapter).toBe(updatedExchangeAdapter);
                // paranoia!
                expect(exchangeAdapter.id).toBe('bitstamp');
                expect(exchangeAdapter.name).toBe('Bitstamp v2');
                expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2');
                expect(exchangeAdapter.botId).toBe(1);
            });
            //.toPromise();
        })));
        it('should NOT return Exchange Adapter for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.update(updatedExchangeAdapter)
                .do(function () {
                fail('should not respond with Exchange Adapter');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.update(updatedExchangeAdapter)
                .do(function () {
                fail('should not respond with Exchange Adapter');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
});
var makeExchangeAdapterData = function () { return [
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
    ])),
]; };
//# sourceMappingURL=exchange-adapter-http-data-observable.service.spec.js.map