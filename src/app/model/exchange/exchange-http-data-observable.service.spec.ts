import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Exchange} from "./exchange.model";
import {ExchangeHttpDataObservableService as ExchangeDataService} from "./exchange-http-data-observable.service";
import {Observable} from "rxjs/Observable";

// Need to explicitly import rxjs operators, else you get runtime error, e.g. 'Failed: this.http.put(...).map is not a function'
import "rxjs/add/observable/throw";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

/**
 * Tests the Exchange HTTP Data Service (Observable flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeHttpDataObservableService tests using TestBed + Mock HTTP backend', () => {

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

        it('should have returned 3 Exchanges ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchanges()
                .do(exchanges => {
                    expect(exchanges.length).toBe(fakeExchanges.length,
                        'should have returned 3 Exchanges');

                    // paranoia!
                    expect(exchanges[0].id).toBe('bitstamp');
                    expect(exchanges[1].id).toBe('gdax');
                    expect(exchanges[2].id).toBe('gemini');
                });
                //.toPromise();
        })));

        it('should handle returning no Exchanges', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchanges()
                .do(exchanges => {
                    expect(exchanges.length).toBe(0, 'should have no Exchanges');
                });
                //.toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchanges()
                .do(() => {
                    fail('should not respond with Exchanges');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
                //.toPromise();
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
            let options = new ResponseOptions({status: 200, body: {data: fakeExchanges}});
            response = new Response(options);
        }));

        it('should have returned GDAX Exchange', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchange('gdax')
                .do(exchange => {
                    expect(exchange.id).toBe('gdax');
                    expect(exchange.name).toBe('GDAX');
                    expect(exchange.status).toBe('Running');
                });
            //.toPromise();
        })));

        it('should handle returning no Exchange', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchange('unknown')
                .do(exchange => {
                    expect(exchange.id).not.toBeDefined('should have no Exchange');
                });
            //.toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchange('unknown')
                .do(() => {
                    fail('should not respond with Exchange');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                });
            //.toPromise();
        })));
    });
});

const makeExchangeData = () => [
    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Stopped'),
    new Exchange('gemini', 'Gemini', 'Running')
] as Exchange[];
