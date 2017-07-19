import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Bot} from "./bot.model";
import {BotHttpDataObservableService as BotDataService} from "./bot-http-data-observable.service";
import {Observable} from "rxjs/Observable";

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import "rxjs/add/observable/throw";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

/**
 * Tests the Bot HTTP Data Service (Observables) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotHttpDataObservableService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                BotDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/
        });
    }));

    it('should instantiate implementation of BotDataService when injected',
        inject([BotDataService], (service: BotDataService) => {
            expect(service instanceof BotDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new BotDataService(http);
        expect(service instanceof BotDataService).toBe(true,
            'new service should be instance of BotDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getBots() operation called', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            let options = new ResponseOptions({status: 200, body: {data: fakeBots}});
            response = new Response(options);
        }));

        it('should have returned 3 Bots ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBots()
                .subscribe(bots => {
                    expect(bots.length).toBe(fakeBots.length,
                        'should have returned 3 Bots');

                    // paranoia!
                    expect(bots[0].id).toBe(1);
                    expect(bots[1].id).toBe(2);
                    expect(bots[2].id).toBe(3);
                });
            //.toPromise();
        })));

        it('should handle returning no Bots', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBots()
                .subscribe(bots => expect(bots.length).toBe(0, 'should have no Bots'));
            //.toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBots()
                .do(() => {
                    fail('should not respond with Bots');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));
    });

    describe('when getBot() operation called with \'2\'', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;
        const GDAX_BOT = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            let options = new ResponseOptions({status: 200, body: {data: fakeBots[GDAX_BOT]}});
            response = new Response(options);
        }));

        it('should have returned GDAX Bot', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBot(1)
                .subscribe(bot => {
                    expect(bot.id).toBe(2);
                    expect(bot.name).toBe('GDAX');
                    expect(bot.status).toBe('Stopped');
                });
            //.toPromise();
        })));

        it('should handle returning no Bot', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBot(100) // unknown id!
                .subscribe(bot => expect(bot.id).not.toBeDefined('should have no Bot'));
            //.toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBot(100) // unknown id!
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));
    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let response: Response;
        let updatedBot: Bot;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedBot = new Bot(2, 'Bitstamp v2', 'Stopped');

            backend = be;
            service = new BotDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedBot}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Bot Adapter on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update(updatedBot)
                .subscribe(bot => {
                    expect(bot).toBe(updatedBot);

                    // paranoia!
                    expect(bot.id).toBe(2);
                    expect(bot.name).toBe('Bitstamp v2');
                    expect(bot.status).toBe('Stopped');
                });
            //.toPromise();
        })));

        it('should NOT return Bot for 401 response', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(updatedBot)
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(updatedBot)
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));
    });

    describe('when getBotByName() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;
        const GDAX_BOT = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            let options = new ResponseOptions({status: 200, body: {data: fakeBots[GDAX_BOT]}});
            response = new Response(options);
        }));

        it('should have returned GDAX Bot', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBotByName('gdax')
                .subscribe(bot => {
                    expect(bot).toBe(fakeBots[GDAX_BOT]);
                });
            //.toPromise();
        })));

        xit('should handle returning no Bot', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBotByName('unknown')
                .subscribe(bot => expect(bot).not.toBeDefined('should have no Bot'));
            // .toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBotByName('unknown')
                .do(() => {
                    fail('should not respond with Bot');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));
    });
});

const makeBotData = () => [
    new Bot(1, 'Bitstamp', 'Running'),
    new Bot(2, 'GDAX', 'Stopped'),
    new Bot(3, 'Gemini', 'Running')
] as Bot[];
