import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {StrategyHttpDataService as StrategyDataService} from './strategy-http-data.service';
import {Strategy, OptionalConfig} from './';

/**
 * Tests the Strategy HTTP Data service using a mocked HTTP backend.
 *
 * TODO - test non 200 OK responses etc from bxbot-ui-server - UI should handle scenario gracefully!
 *
 * @author gazbert
 */
describe('StrategyHttpDataService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                StrategyDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of StrategyDataService service when injected',
        inject([StrategyDataService], (service: StrategyDataService) => {
            expect(service instanceof StrategyDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new StrategyDataService(http);
        expect(service instanceof StrategyDataService).toBe(true,
            'new service should be instance of StrategyDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getAllStrategiesForBotId() operation called with \'huobi\'', () => {

        let backend: MockBackend;
        let service: StrategyDataService;
        let fakeStrategies: Strategy[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new StrategyDataService(http);
            fakeStrategies = makeStrategyData();
            const options = new ResponseOptions({status: 200, body: {data: fakeStrategies}});
            response = new Response(options);
        }));

        it('should return 2 Huobi Strategies', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllStrategiesForBotId('huobi-2')
                .then(strategies => expect(strategies.length).toBe(2, 'should return 2 Huobi Strategies'));
        })));

        it('should handle returning no matching Strategies', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllStrategiesForBotId('unknown')
                .then(strategies => expect(strategies.length).toBe(0, 'should have no Strategies'));
        })));
    });

    describe('when updateStrategy() operation called for Huobi', () => {

        let backend: MockBackend;
        let service: StrategyDataService;
        let response: Response;
        let updatedStrategy: Strategy;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedStrategy = new Strategy('huobi_macd', 'huobi-2', 'MACD Indicator',
                'MACD Indicator algo for deciding when to enter and exit trades.',
                'com.gazbert.bxbot.strategies.MacdStrategy',

                new OptionalConfig([
                        {
                            name: 'ema-short-interval',
                            value: '12'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '26'
                        },
                        {
                            name: 'signal-line',
                            value: '9'
                        }
                    ]
                )
            );

            backend = be;
            service = new StrategyDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedStrategy}});
            response = new Response(options);
        }));

        it('should return updated Huobi Strategy on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateStrategy('huobi', updatedStrategy)
                .then(strategy => {
                    expect(strategy).toBe(updatedStrategy);

                    // paranoia!
                    expect(strategy.id).toBe(updatedStrategy.id);
                    expect(strategy.name).toBe(updatedStrategy.name);
                    expect(strategy.className).toBe(updatedStrategy.className);
                });
        })));

        it('should NOT return Market for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateStrategy('huobi', updatedStrategy)
                .then(strategy => expect(strategy.id).not.toBeDefined('should have no Strategy'));
        })));
    });

    describe('when deleteStrategyById() operation called with \'huobi_macd\'', () => {

        let backend: MockBackend;
        let service: StrategyDataService;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new StrategyDataService(http);
            const options = new ResponseOptions({status: 200});
            response = new Response(options);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.deleteStrategyById('huobi', 'huobi_macd')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteStrategyById('huobi', 'unknown')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeStrategyData = () => [

    new Strategy('huobi_macd', 'huobi-2', 'MACD Indicator',
        'MACD Indicator algo for deciding when to enter and exit trades.',
        'com.gazbert.bxbot.strategies.MacdRsiStrategy',

        new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                },
                {
                    name: 'signal-line',
                    value: '9'
                }
            ]
        )
    ),

    new Strategy('huobi_macd', 'huobi-2', 'MACD Indicator',
        'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',

        new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                },
                {
                    name: 'signal-line',
                    value: '9'
                }
            ]
        )
    )
] as Strategy[];
