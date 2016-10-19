import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Exchange, NetworkConfig} from "./exchange.model";
import {ExchangeHttpDataService as ExchangeDataService} from "./exchange-http-data.service";

import { Observable } from 'rxjs/Observable';
// NOTE: We need to explicitly pull the rxjs operators in - if not, we get a stinky runtime error e.g.
// 'Failed: this.http.get(...).map is not a function'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


const makeExchangeData = () => [
    new Exchange('Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
    new Exchange('GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
    new Exchange('Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
] as Exchange[];

/**
 * Test getExchangesUsingPromise() operation.
 */
describe('Tests ExchangeHttpDataService (mockBackend)', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ExchangeDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('can instantiate service when inject service',
        inject([ExchangeDataService], (service: ExchangeDataService) => {
            expect(service instanceof ExchangeDataService).toBe(true);
        }));

    it('can instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ExchangeDataService(http);
        expect(service instanceof ExchangeDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about?
    it('can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    /**
     * Tests getExchangesUsingPromise service operation using a mocked HTTP backend.
     */
    describe('when getExchangesUsingPromise', () => {

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

        it('should have expected fake Exchanges (using promise then)', async(inject([], () => {

            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchangesUsingPromise()
            // .then(() => Promise.reject('deliberate'))
                .then(exchanges => {
                    expect(exchanges.length).toBe(fakeExchanges.length,
                        'should have expected 3 Exchanges');
                });
        })));

        it('should have expected fake Exchanges (Observable.do)', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));

            service.getExchangesUsingObservable()
                .do(exchanges => {
                    expect(exchanges.length).toBe(fakeExchanges.length,
                        'should have expected 3 Exchanges');
                })
                .toPromise();
        })));

        it('should be OK returning no Exchanges', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchangesUsingObservable()
                .do(exchanges => {
                    expect(exchanges.length).toBe(0, 'should have no Exchanges');
                })
                .toPromise();
        })));

        it('should treat 404 as an Observable error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchangesUsingObservable()
                .do(exchanges => {
                    fail('should not respond with Exchanges');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                    return Observable.of(null); // failure is the expected test result
                })
                .toPromise();
        })));
    });
});
