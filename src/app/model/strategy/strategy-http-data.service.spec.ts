import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {StrategyHttpDataService as TradingStrategyDataService} from './strategy-http-data.service';
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
                TradingStrategyDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of TradingStrategyDataService service when injected',
        inject([TradingStrategyDataService], (service: TradingStrategyDataService) => {
            expect(service instanceof TradingStrategyDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new TradingStrategyDataService(http);
        expect(service instanceof TradingStrategyDataService).toBe(true,
            'new service should be instance of TradingStrategyDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getAllStrategiesForBotId() operation called with \'huobi\'', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let fakeTradingStrategies: Strategy[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TradingStrategyDataService(http);
            fakeTradingStrategies = makeTradingStrategyData();
            const options = new ResponseOptions({status: 200, body: {data: fakeTradingStrategies}});
            response = new Response(options);
        }));

        it('should return 2 Huobi Trading Strategies', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllStrategiesForBotId('huobi-2')
                .then(tradingStrategies => expect(tradingStrategies.length).toBe(2, 'should return 2 Huobi Trading Strategies'));
        })));

        it('should handle returning no matching Trading Strategies', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllStrategiesForBotId('unknown')
                .then(tradingStrategies => expect(tradingStrategies.length).toBe(0, 'should have no Trading Strategies'));
        })));
    });

    describe('when updateStrategy() operation called for Huobi', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let response: Response;
        let updatedTradingStrategy: Strategy;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedTradingStrategy = new Strategy('huobi_macd', 'huobi-2', 'MACD Indicator',
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
            service = new TradingStrategyDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedTradingStrategy}});
            response = new Response(options);
        }));

        it('should return updated Huobi Trading Strategy on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateStrategy(updatedTradingStrategy)
                .then(tradingStrategy => {
                    expect(tradingStrategy).toBe(updatedTradingStrategy);

                    // paranoia!
                    expect(tradingStrategy.id).toBe(updatedTradingStrategy.id);
                    expect(tradingStrategy.name).toBe(updatedTradingStrategy.name);
                    expect(tradingStrategy.className).toBe(updatedTradingStrategy.className);
                });
        })));

        it('should NOT return Market for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateStrategy(updatedTradingStrategy)
                .then(tradingStrategy => expect(tradingStrategy.id).not.toBeDefined('should have no Trading Strategy'));
        })));
    });

    describe('when deleteStrategyById() operation called with \'huobi_macd\'', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TradingStrategyDataService(http);
            const options = new ResponseOptions({status: 200});
            response = new Response(options);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.deleteStrategyById('huobi_macd')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteStrategyById('unknown')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeTradingStrategyData = () => [

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


