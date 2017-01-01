import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {TradingStrategyHttpDataPromiseService as TradingStrategyDataService} from './trading-strategy-http-data-promise.service';
import {TradingStrategy} from "../trading-strategy";

/**
 * Tests the Trading Strategy HTTP service (Promise flavour) using a mocked HTTP backend.
 * TODO tests for deleteTradingStrategyById() and updateTradingStrategy()
 *
 * @author gazbert
 */
describe('TradingStrategyHttpDataPromiseService tests using TestBed and Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                TradingStrategyDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('should instantiate service when inject service',
        inject([TradingStrategyDataService], (service: TradingStrategyDataService) => {
            expect(service instanceof TradingStrategyDataService).toBe(true);
    }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new TradingStrategyDataService(http);
        expect(service instanceof TradingStrategyDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about? Are we just testing Angular here?
    it('should provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
    }));

    describe('when getAllTradingStrategiesForExchange called', () => {

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

        it('should expect 2 BTC-e Trading Strategies', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllTradingStrategiesForExchange('btce')
                .then(markets => {
                    expect(markets.length).toBe(2, 'should expect 2 BTC-e Trading Strategies');
                });
        })));

        it('should be OK returning no matching Trading Strategies', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllTradingStrategiesForExchange('muh')
                .then(markets => {
                    expect(markets.length).toBe(0, 'should have no Trading Strategies');
                });
        })));

        // TODO FIXME
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getAllTradingStrategiesForExchange('muh')
                .then(() => {
                    fail('should not respond with Trading Strategies');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                });
        })));
    });
});

const makeTradingStrategyData = () => [

    //     new TradingStrategy('bitstamp_macd', 'bitstamp', 'MACD Indicator',
    //         'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy'),

    //     new TradingStrategy('gdax_ema', 'gdax', 'EMA Indicator',
    //         'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy'),

        new TradingStrategy('btce_macd_rsi', 'btce', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy'),

        new TradingStrategy('btce_macd', 'btce', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')

] as TradingStrategy[];


