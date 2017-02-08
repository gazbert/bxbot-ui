import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {TradingStrategyHttpDataPromiseService as TradingStrategyDataService} from './trading-strategy-http-data-promise.service';
import {TradingStrategy} from "../trading-strategy";

/**
 * Tests the Trading Strategy HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * TODO - test for deleteTradingStrategyById()
 *
 * @author gazbert
 */
describe('TradingStrategyHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

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
        let service = new TradingStrategyDataService(http);
        expect(service instanceof TradingStrategyDataService).toBe(true,
            'new service should be instance of TradingStrategyDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));

    describe('when getAllTradingStrategiesForExchange() operation called with \'btce\'', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let fakeTradingStrategies: TradingStrategy[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TradingStrategyDataService(http);
            fakeTradingStrategies = makeTradingStrategyData();
            let options = new ResponseOptions({status: 200, body: {data: fakeTradingStrategies}});
            response = new Response(options);
        }));

        it('should return 2 BTC-e Trading Strategies', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllTradingStrategiesForExchange('btce')
                .then(tradingStrategies => {
                    expect(tradingStrategies.length).toBe(2, 'should return 2 BTC-e Trading Strategies');
                });
        })));

        it('should handle returning no matching Trading Strategies', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllTradingStrategiesForExchange('unknown')
                .then(tradingStrategies => {
                    expect(tradingStrategies.length).toBe(0, 'should have no Trading Strategies');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getAllTradingStrategiesForExchange('unknown')
                .then(() => {
                    fail('should not respond with Trading Strategies');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when updateTradingStrategy() operation called for BTC-e', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let response: Response;
        let updatedTradingStrategy: TradingStrategy;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedTradingStrategy = new TradingStrategy('btce_macd_rsi', 'btce', 'MACD Indicator',
                'MACD Indicator algo for deciding when to enter and exit trades.',
                'com.gazbert.bxbot.strategies.MacdStrategy');

            backend = be;
            service = new TradingStrategyDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedTradingStrategy}});
            response = new Response(options);
        }));

        it('should return updated BTC-e Trading Strategy', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateTradingStrategy(updatedTradingStrategy)
                .then(tradingStrategy => {
                    expect(tradingStrategy).toBe(updatedTradingStrategy);

                    // paranoia!
                    expect(tradingStrategy.id).toBe(updatedTradingStrategy.id);
                    expect(tradingStrategy.name).toBe(updatedTradingStrategy.name);
                    expect(tradingStrategy.className).toBe(updatedTradingStrategy.className);

                });
        })));

        // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
        xit('should handle returning no matching Trading Strategies', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateTradingStrategy(updatedTradingStrategy)
                .then(tradingStrategy => {
                    expect(tradingStrategy.id).not.toBeDefined('should have no Trading Strategy');
                });
        })));

        // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.updateTradingStrategy(updatedTradingStrategy)
                .then(() => {
                    fail('should not respond with Trading Strategy');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });
});

const makeTradingStrategyData = () => [

        new TradingStrategy('btce_macd_rsi', 'btce', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy'),

        new TradingStrategy('btce_macd', 'btce', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')

] as TradingStrategy[];


