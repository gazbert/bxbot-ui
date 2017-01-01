import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {MarketHttpDataPromiseService as MarketDataService} from "./market-http-data-promise.service";
import {TradingStrategy} from "../trading-strategy";
import {Market} from "./market.model";

/**
 * Tests the Market HTTP service (Promise flavour) using a mocked HTTP backend.
 * TODO tests for deleteMarketById() and updateMarket()
 *
 * @author gazbert
 */
describe('MarketHttpDataPromiseService tests using TestBed and Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MarketDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('should instantiate service when inject service',
        inject([MarketDataService], (service: MarketDataService) => {
            expect(service instanceof MarketDataService).toBe(true);
    }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new MarketDataService(http);
        expect(service instanceof MarketDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about? Are we just testing Angular here?
    it('should provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
    }));

    describe('when getAllMarketsForExchange called', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let fakeMarkets: Market[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new MarketDataService(http);
            fakeMarkets = makeMarketData();
            let options = new ResponseOptions({status: 200, body: {data: fakeMarkets}});
            response = new Response(options);
        }));

        it('should expect 2 BTC-e Markets', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllMarketsForExchange('btce')
                .then(markets => {
                    expect(markets.length).toBe(2, 'should expect 2 BTC-e Markets');
                });
        })));

        it('should be OK returning no matching Markets', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllMarketsForExchange('muh')
                .then(markets => {
                    expect(markets.length).toBe(0, 'should have no Markets');
                });
        })));

        // TODO FIXME
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getAllMarketsForExchange('muh')
                .then(() => {
                    fail('should not respond with Markets');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                });
        })));
    });
});

const makeMarketData = () => [

    // new Market('bitstamp_btc_usd', 'bitstamp', 'BTC/USD', true, 'BTC', 'USD',
    //     new TradingStrategy('bitstamp_macd', 'bitstamp', 'MACD Indicator',
    //         'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')),

    // new Market('gdax_btc_gbp', 'gdax', 'BTC/GBP', true, 'BTC', 'GBP',
    //     new TradingStrategy('gdax_ema', 'gdax', 'EMA Indicator',
    //         'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy')),

    new Market('btce_btc_usd', 'btce', 'BTC/USD', true, 'BTC', 'USD',
        new TradingStrategy('btce_macd_rsi', 'btce', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy')),

    new Market('btce__btc_usd', 'btce_', 'BTC/USD', true, 'BTC', 'USD',
        new TradingStrategy('btce_macd', 'btce', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')),

] as Market[];


