import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {MarketHttpDataPromiseService as MarketDataService} from "./market-http-data-promise.service";
import {TradingStrategy} from "../trading-strategy";
import {Market} from "./market.model";

/**
 * Tests the Market HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('MarketHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                MarketDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of MarketDataService when injected',
        inject([MarketDataService], (service: MarketDataService) => {
            expect(service instanceof MarketDataService).toBe(true);
    }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new MarketDataService(http);
        expect(service instanceof MarketDataService).toBe(true,
            'new service should be instance of MarketDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));

    describe('when getAllMarketsForBotId() operation called with \'btce\'', () => {

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

        it('should return 2 BTC-e Markets', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllMarketsForBotId(3)
                .then(markets => {
                    expect(markets.length).toBe(2, 'should return 2 BTC-e Markets');

                    // basic sanity check
                    expect(markets[0].id).toBe('btce_btc_usd');
                    expect(markets[1].id).toBe('btce_ltc_usd');
                });
        })));

        it('should handle returning no matching Markets', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllMarketsForBotId(100) // unknown id
                .then(markets => expect(markets.length).toBe(0, 'should have no Markets'));
        })));
    });

    describe('when updateMarket() operation called for BTC-e', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let response: Response;
        let updatedMarket: Market;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedMarket = new Market('btce_btc_usd', 3, 'BTC/USD', true, 'BTC', 'USD',
                new TradingStrategy('btce_macd', 'btce', 'MACD Indicator',
                    'MACD Indicator for deciding when to enter and exit trades.',
                    'com.gazbert.bxbot.strategies.MacdStrategy'));

            backend = be;
            service = new MarketDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedMarket}});
            response = new Response(options);
        }));

        it('should return updated BTC-e Market on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateMarket(updatedMarket)
                .then(market => {
                    expect(market).toBe(updatedMarket);

                    // paranoia!
                    expect(market.tradingStrategy.id).toBe(updatedMarket.tradingStrategy.id);
                    expect(market.tradingStrategy.name).toBe(updatedMarket.tradingStrategy.name);
                    expect(market.tradingStrategy.className).toBe(updatedMarket.tradingStrategy.className);
                });
        })));

        it('should NOT return Market for 401 response', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateMarket(updatedMarket)
                .then(market => expect(market.id).not.toBeDefined('should have no Market'));
        })));
    });

    describe('when deleteMarketById() operation called with \'btce_btc_usd\'', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new MarketDataService(http);
            let options = new ResponseOptions({status: 200});
            response = new Response(options);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.deleteMarketById('btce_btc_usd')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteMarketById('unknown')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeMarketData = () => [

    new Market('btce_btc_usd', 3, 'BTC/USD', true, 'BTC', 'USD',
        new TradingStrategy('btce_macd_rsi', 'btce', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy')),

    new Market('btce_ltc_usd', 3, 'LTC/USD', true, 'LTC', 'USD',
        new TradingStrategy('btce_macd', 'btce', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')),

] as Market[];


