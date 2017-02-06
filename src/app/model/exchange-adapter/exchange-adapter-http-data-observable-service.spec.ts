import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {ExchangeAdapterHttpDataObservableService as ExchangeAdapterDataService} from "./exchange-adapter-http-data-observable.service";
import {ExchangeAdapter, NetworkConfig} from "./exchange-adapter.model";
import {Observable} from "rxjs/Observable";

// Need to explicitly import rxjs operators, else you get runtime error, e.g. 'Failed: this.http.put(...).map is not a function'
import "rxjs/add/observable/throw";
import "rxjs/add/operator/do";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";

/**
 * Tests the Exchange Adapter HTTP service (Observable flavour) using a mocked HTTP backend.
 *
 * TODO tests for getExchangeAdapterByExchangeId() and update()
 *
 * @author gazbert
 */
describe('ExchangeAdapterHttpDataObservableService tests using TestBed and Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ExchangeAdapterDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('should instantiate service when inject service',
        inject([ExchangeAdapterDataService], (service: ExchangeAdapterDataService) => {
            expect(service instanceof ExchangeAdapterDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ExchangeAdapterDataService(http);
        expect(service instanceof ExchangeAdapterDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about? Just testing Angular?
    it('should provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
    }));

    describe('when getExchangeAdapters', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let fakeExchangeAdapters: ExchangeAdapter[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ExchangeAdapterDataService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchangeAdapters}});
            response = new Response(options);
        }));

        it('should have expected fake Exchange Adapters ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchangeAdapters()
                .do(exchangeAdapters => {
                    expect(exchangeAdapters.length).toBe(fakeExchangeAdapters.length,
                        'should have expected 3 Exchange Adapters');
                })
                .toPromise();
        })));

        it('should be OK returning no Exchange Adapters', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapters()
                .do(exchangeAdapters => {
                    expect(exchangeAdapters.length).toBe(0, 'should have no Exchange Adapters');
                })
                .toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapters()
                .do(() => {
                    fail('should not respond with Exchange Adapters');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                })
                .toPromise();
        })));
    });
});

const makeExchangeAdapterData = () => [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
] as ExchangeAdapter[];
