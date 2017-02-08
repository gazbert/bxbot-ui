import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {ExchangeAdapterHttpDataPromiseService as ExchangeAdapterDataService} from "./exchange-adapter-http-data-promise.service";
import {ExchangeAdapter, NetworkConfig} from "./exchange-adapter.model";

/**
 * Tests the Exchange Adapter HTTP Data service (Promise flavour) using a Mock HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeAdapterHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ExchangeAdapterDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of ExchangeAdapterDataService when injected',
        inject([ExchangeAdapterDataService], (service: ExchangeAdapterDataService) => {
            expect(service instanceof ExchangeAdapterDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ExchangeAdapterDataService(http);
        expect(service instanceof ExchangeAdapterDataService).toBe(true,
            'new service should be instance of ExchangeAdapterDataService');
    }));

    it('should provide MockBackend as replacement for XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend should be provided');
    }));

    describe('when getExchangeAdapters() operation called', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let fakeExchangeAdapters: ExchangeAdapter[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
            backend = mockBackend;
            service = new ExchangeAdapterDataService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchangeAdapters}});
            response = new Response(options);
        }));

        it('should return 3 Exchanges Adapters', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchangeAdapters()
                .then(exchangeAdapters => {
                    expect(exchangeAdapters.length).toBe(fakeExchangeAdapters.length,
                        'should have returned 3 Exchange Adapters');

                    // basic sanity check
                    expect(exchangeAdapters[0].id).toBe('bitstamp');
                    expect(exchangeAdapters[1].id).toBe('gdax');
                    expect(exchangeAdapters[2].id).toBe('gemini');
                });
        })));

        it('should handle returning no Exchange Adapters', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapters()
                .then(exchangeAdapters => {
                    expect(exchangeAdapters.length).toBe(0, 'should have no Exchange Adapters');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchangeAdapters()
                .then(() => {
                    fail('should not respond with Exchanges Adapters');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when getExchangeAdapterByExchangeId() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let fakeExchangeAdapters: ExchangeAdapter[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
            backend = mockBackend;
            service = new ExchangeAdapterDataService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchangeAdapters[1]}});
            response = new Response(options);
        }));

        it('should return GDAX Exchange Adapter', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchangeAdapterByExchangeId('gdax')
                .then(exchangeAdapter => {
                    expect(exchangeAdapter.id).toBe('gdax');
                    expect(exchangeAdapter.name).toBe('GDAX');
                    expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
                    expect(exchangeAdapter.networkConfig.connectionTimeout).toBe(60);

                    expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
                    expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0].value).toBe(503);
                    expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBe(504);
                    expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[2].value).toBe(522);

                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[0].value).toBe(
                        "Connection reset"
                    );
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[1].value).toBe(
                        "Connection refused"
                    );
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[2].value).toBe(
                        "Remote host closed connection during handshake"
                    );
                });
        })));

        it('should handle returning no Exchange Adapter', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapterByExchangeId('unknown')
                .then(exchangeAdapter => {
                    expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchangeAdapterByExchangeId('unknown')
                .then(() => {
                    fail('should not respond with Exchange Adapter');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let response: Response;
        let updatedExchangeAdapter: ExchangeAdapter;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {

            updatedExchangeAdapter = new ExchangeAdapter('bitstamp', 'Bitstamp v2',
                'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2',
                new NetworkConfig(90,
                    [
                        {value: 504},
                        {value: 505},
                        {value: 506},
                    ],
                    [
                        {value: "Connection reset again!"},
                        {value: "Connection refused again!"},
                        {value: "Remote host closed connection during handshake again!"}
                    ]
                ));

            backend = mockBackend;
            service = new ExchangeAdapterDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedExchangeAdapter}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Exchange Adapter', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update(updatedExchangeAdapter)
                .then(exchangeAdapter => {
                    expect(exchangeAdapter).toBe(updatedExchangeAdapter);

                    // paranoia!
                    expect(exchangeAdapter.id).toBe('bitstamp');
                    expect(exchangeAdapter.name).toBe('Bitstamp v2');
                    expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2');
                });
        })));

        it('should handle Exchange Adapter not found', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(updatedExchangeAdapter)
                .then(exchangeAdapter => {
                    expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.update(updatedExchangeAdapter)
                .then(() => {
                    fail('should not respond with Exchange Adapter');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });
});

const makeExchangeAdapterData = () => [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 501},
                {value: 502},
                {value: 503},
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
                {value: 504},
                {value: 505},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
] as ExchangeAdapter[];

