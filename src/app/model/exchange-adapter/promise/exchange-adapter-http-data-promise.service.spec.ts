import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {ExchangeAdapterHttpDataPromiseService as ExchangeAdapterDataService} from './exchange-adapter-http-data-promise.service';
import {ExchangeAdapter, NetworkConfig} from '../exchange-adapter.model';

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
        const service = new ExchangeAdapterDataService(http);
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
            const options = new ResponseOptions({status: 200, body: {data: fakeExchangeAdapters}});
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
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapters()
                .then(exchangeAdapters => expect(exchangeAdapters.length).toBe(0, 'should have no Exchange Adapters'));
        })));
    });

    describe('when getExchangeAdapterByBotId() operation called with \'2\'', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let fakeExchangeAdapters: ExchangeAdapter[];
        let response: Response;
        const GDAX_EXCHANGE = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
            backend = mockBackend;
            service = new ExchangeAdapterDataService(http);
            fakeExchangeAdapters = makeExchangeAdapterData();
            const options = new ResponseOptions({status: 200, body: {data: fakeExchangeAdapters[GDAX_EXCHANGE]}});
            response = new Response(options);
        }));

        xit('should return GDAX Exchange Adapter', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchangeAdapterByBotId(2)
                .then(exchangeAdapter => {
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
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).toBe(
                        'Connection reset'
                    );
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe(
                        'Connection refused'
                    );
                    expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[2]).toBe(
                        'Remote host closed connection during handshake'
                    );
                });
        })));

        xit('should handle returning no Bot Adapter', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchangeAdapterByBotId(100) // unknown id
                .then(exchangeAdapter => expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter'));
        })));
    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: MockBackend;
        let service: ExchangeAdapterDataService;
        let response: Response;
        let updatedExchangeAdapter: ExchangeAdapter;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {

            updatedExchangeAdapter = new ExchangeAdapter('bitstamp', 'Bitstamp v2',
                'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2', 1,
                new NetworkConfig(90,
                    [
                        504,
                        505,
                        506,
                    ],
                    [
                        'Connection reset again!',
                        'Connection refused again!',
                        'Remote host closed connection during handshake again!'
                    ]
                ));

            backend = mockBackend;
            service = new ExchangeAdapterDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedExchangeAdapter}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Exchange Adapter on success', async(inject([], () => {
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

        it('should NOT return Bot Adapter for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(updatedExchangeAdapter)
                .then(exchangeAdapter => expect(exchangeAdapter.id).not.toBeDefined('should have no Exchange Adapter'));
        })));
    });
});

const makeExchangeAdapterData = () => [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter', 1,
        new NetworkConfig(60,
            [
                501,
                502,
                503,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        )),
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter', 2,
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        )),
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter', 3,
        new NetworkConfig(60,
            [
                504,
                505,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ))
] as ExchangeAdapter[];

