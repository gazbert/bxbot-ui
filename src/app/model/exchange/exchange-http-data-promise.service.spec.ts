import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Exchange} from "./exchange.model";
import {ExchangeHttpDataPromiseService as ExchangeDataService} from "./exchange-http-data-promise.service";

/**
 * Tests the Exchange HTTP Data Service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ExchangeDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of ExchangeDataService when injected',
        inject([ExchangeDataService], (service: ExchangeDataService) => {
            expect(service instanceof ExchangeDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ExchangeDataService(http);
        expect(service instanceof ExchangeDataService).toBe(true,
            'new service should be instance of ExchangeDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getExchanges() operation called', () => {

        let backend: MockBackend;
        let service: ExchangeDataService;
        let fakeExchanges: Exchange[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ExchangeDataService(http);
            fakeExchanges = makeExchangeData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchanges}});
            response = new Response(options);
        }));

        it('should return 3 Exchanges ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchanges()
                .then(exchanges => {
                    expect(exchanges.length).toBe(fakeExchanges.length,
                        'should have returned 3 Exchanges');

                    // paranoia!
                    expect(exchanges[0].id).toBe('bitstamp');
                    expect(exchanges[1].id).toBe('gdax');
                    expect(exchanges[2].id).toBe('gemini');
                });
        })));

        it('should handle returning no Exchanges', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchanges()
                .then(exchanges => {
                    expect(exchanges.length).toBe(0, 'should have no Exchanges');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchanges()
                .then(() => {
                    fail('should not respond with Exchanges');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when getExchange() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: ExchangeDataService;
        let fakeExchanges: Exchange[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ExchangeDataService(http);
            fakeExchanges = makeExchangeData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchanges[1]}});
            response = new Response(options);
        }));

        it('should return GDAX Exchange ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchange('gdax')
                .then(exchange => {
                    expect(exchange.id).toBe('gdax');
                    expect(exchange.name).toBe('GDAX');
                    expect(exchange.status).toBe('Running');
                });
        })));

        it('should handle returning no Exchange', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchange('unknown')
                .then(exchange => {
                    expect(exchange.id).not.toBeDefined('should have no Exchange');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchange('unknown')
                .then(() => {
                    fail('should not respond with Exchange');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: MockBackend;
        let service: ExchangeDataService;
        let response: Response;
        let updatedExchange: Exchange;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedExchange = new Exchange('bitstamp', 'BitstampV2', 'Stopped');

            backend = be;
            service = new ExchangeDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedExchange}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Exchange ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update(updatedExchange)
                .then(exchange => {
                    expect(exchange.id).toBe('bitstamp');
                    expect(exchange.name).toBe('BitstampV2');
                    expect(exchange.status).toBe('Stopped');
                });
        })));

        it('should handle returning no Exchange', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(updatedExchange)
                .then(exchange => {
                    expect(exchange.id).not.toBeDefined('should have no Exchange');
                });
        })));

        // TODO - FIXME - 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.update(updatedExchange)
                .then(() => {
                    fail('should not respond with Exchange');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });
});

const makeExchangeData = () => [
    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Running'),
    new Exchange('gemini', 'Gemini', 'Stopped'),
] as Exchange[];

