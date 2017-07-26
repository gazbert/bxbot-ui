import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {TradingStrategyHttpDataPromiseService as TradingStrategyDataService} from './trading-strategy-http-data-promise.service';
import {TradingStrategy} from '../trading-strategy';

/**
 * Tests the Trading Strategy HTTP Data service (Promise flavour) using a mocked HTTP backend.
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
        const service = new TradingStrategyDataService(http);
        expect(service instanceof TradingStrategyDataService).toBe(true,
            'new service should be instance of TradingStrategyDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));

    describe('when getAllTradingStrategiesForBotId() operation called with \'btce\'', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let fakeTradingStrategies: TradingStrategy[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new TradingStrategyDataService(http);
            fakeTradingStrategies = makeTradingStrategyData();
            const options = new ResponseOptions({status: 200, body: {data: fakeTradingStrategies}});
            response = new Response(options);
        }));

        it('should return 2 BTC-e Trading Strategies', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllTradingStrategiesForBotId('btce-2')
                .then(tradingStrategies => expect(tradingStrategies.length).toBe(2, 'should return 2 BTC-e Trading Strategies'));
        })));

        it('should handle returning no matching Trading Strategies', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllTradingStrategiesForBotId('unknown')
                .then(tradingStrategies => expect(tradingStrategies.length).toBe(0, 'should have no Trading Strategies'));
        })));
    });

    describe('when updateTradingStrategy() operation called for BTC-e', () => {

        let backend: MockBackend;
        let service: TradingStrategyDataService;
        let response: Response;
        let updatedTradingStrategy: TradingStrategy;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedTradingStrategy = new TradingStrategy('btce_macd_rsi', 'btce-2', 'MACD Indicator',
                'MACD Indicator algo for deciding when to enter and exit trades.',
                'com.gazbert.bxbot.strategies.MacdStrategy');

            backend = be;
            service = new TradingStrategyDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedTradingStrategy}});
            response = new Response(options);
        }));

        it('should return updated BTC-e Trading Strategy on success', async(inject([], () => {
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

        it('should NOT return Market for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateTradingStrategy(updatedTradingStrategy)
                .then(tradingStrategy => expect(tradingStrategy.id).not.toBeDefined('should have no Trading Strategy'));
        })));
    });

    describe('when deleteTradingStrategyById() operation called with \'btce_macd_rsi\'', () => {

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
            service.deleteTradingStrategyById('btce_macd_rsi')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteTradingStrategyById('unknown')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeTradingStrategyData = () => [

        new TradingStrategy('btce_macd_rsi', 'btce-2', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy'),

        new TradingStrategy('btce_macd', 'btce-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')

] as TradingStrategy[];


