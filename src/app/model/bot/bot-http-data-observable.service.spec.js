"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var bot_model_1 = require("./bot.model");
var bot_http_data_observable_service_1 = require("./bot-http-data-observable.service");
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
 * Tests the Bot HTTP Data Service (Observables) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotHttpDataObservableService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                bot_http_data_observable_service_1.BotHttpDataObservableService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        })
            .compileComponents().then(function () {
        });
    }));
    it('should instantiate implementation of BotDataService when injected', testing_2.inject([bot_http_data_observable_service_1.BotHttpDataObservableService], function (service) {
        expect(service instanceof bot_http_data_observable_service_1.BotHttpDataObservableService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new bot_http_data_observable_service_1.BotHttpDataObservableService(http);
        expect(service instanceof bot_http_data_observable_service_1.BotHttpDataObservableService).toBe(true, 'new service should be instance of BotDataService');
    }));
    it('should provide the MockBackend as XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));
    describe('when getBots() operation called', function () {
        var backend;
        var service;
        var fakeBots;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new bot_http_data_observable_service_1.BotHttpDataObservableService(http);
            fakeBots = makeBotData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeBots } });
            response = new http_1.Response(options);
        }));
        it('should have returned 3 Bots ', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getBots()
                .subscribe(function (bots) {
                expect(bots.length).toBe(fakeBots.length, 'should have returned 3 Bots');
                // paranoia!
                expect(bots[0].id).toBe(1);
                expect(bots[1].id).toBe(2);
                expect(bots[2].id).toBe(3);
            });
            //.toPromise();
        })));
        it('should handle returning no Bots', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBots()
                .subscribe(function (bots) { return expect(bots.length).toBe(0, 'should have no Bots'); });
            //.toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBots()
                .do(function () {
                fail('should not respond with Bots');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
    describe('when getBot() operation called with \'2\'', function () {
        var backend;
        var service;
        var fakeBots;
        var response;
        var GDAX_BOT = 1;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new bot_http_data_observable_service_1.BotHttpDataObservableService(http);
            fakeBots = makeBotData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeBots[GDAX_BOT] } });
            response = new http_1.Response(options);
        }));
        it('should have returned GDAX Bot', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getBot(1)
                .subscribe(function (bot) {
                expect(bot.id).toBe(2);
                expect(bot.name).toBe('GDAX');
                expect(bot.status).toBe('Stopped');
            });
            //.toPromise();
        })));
        it('should handle returning no Bot', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBot(100) // unknown id!
                .subscribe(function (bot) { return expect(bot.id).not.toBeDefined('should have no Bot'); });
            //.toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBot(100) // unknown id!
                .do(function () {
                fail('should not respond with Bot');
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
        var updatedBot;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            updatedBot = new bot_model_1.Bot(2, 'Bitstamp v2', 'Stopped');
            backend = be;
            service = new bot_http_data_observable_service_1.BotHttpDataObservableService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedBot } });
            response = new http_1.Response(options);
        }));
        it('should return updated Bitstamp Bot Adapter on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.update(updatedBot)
                .subscribe(function (bot) {
                expect(bot).toBe(updatedBot);
                // paranoia!
                expect(bot.id).toBe(2);
                expect(bot.name).toBe('Bitstamp v2');
                expect(bot.status).toBe('Stopped');
            });
            //.toPromise();
        })));
        it('should NOT return Bot for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.update(updatedBot)
                .do(function () {
                fail('should not respond with Bot');
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
            service.update(updatedBot)
                .do(function () {
                fail('should not respond with Bot');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
    describe('when getBotByName() operation called with \'gdax\'', function () {
        var backend;
        var service;
        var fakeBots;
        var response;
        var GDAX_BOT = 1;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new bot_http_data_observable_service_1.BotHttpDataObservableService(http);
            fakeBots = makeBotData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeBots[GDAX_BOT] } });
            response = new http_1.Response(options);
        }));
        it('should have returned GDAX Bot', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getBotByName('gdax')
                .subscribe(function (bot) {
                expect(bot).toBe(fakeBots[GDAX_BOT]);
            });
            //.toPromise();
        })));
        xit('should handle returning no Bot', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { data: [] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBotByName('unknown')
                .subscribe(function (bot) { return expect(bot).not.toBeDefined('should have no Bot'); });
            // .toPromise();
        })));
        it('should treat 404 as an Observable error', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 404 }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getBotByName('unknown')
                .do(function () {
                fail('should not respond with Bot');
            })
                .catch(function (err) {
                expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                return Observable_1.Observable.of(null); // failure is the expected test result
            });
            //.toPromise();
        })));
    });
});
var makeBotData = function () { return [
    new bot_model_1.Bot(1, 'Bitstamp', 'Running'),
    new bot_model_1.Bot(2, 'GDAX', 'Stopped'),
    new bot_model_1.Bot(3, 'Gemini', 'Running')
]; };
//# sourceMappingURL=bot-http-data-observable.service.spec.js.map