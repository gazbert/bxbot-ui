import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {MarketHttpDataPromiseService as MarketDataService} from './market-http-data-promise.service';
import {TradingStrategy} from '../trading-strategy';
import {Market} from './market.model';

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
        const service = new MarketDataService(http);
        expect(service instanceof MarketDataService).toBe(true,
            'new service should be instance of MarketDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));

    describe('when getAllMarketsForBotId() operation called with \'huobi\'', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let fakeMarkets: Market[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new MarketDataService(http);
            fakeMarkets = makeMarketData();
            const options = new ResponseOptions({status: 200, body: {data: fakeMarkets}});
            response = new Response(options);
        }));

        it('should return 2 Huobi Markets', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllMarketsForBotId('huobi-1')
                .then(markets => {
                    expect(markets.length).toBe(2, 'should return 2 Huobi Markets');

                    // basic sanity check
                    expect(markets[0].id).toBe('huobi_btc_usd');
                    expect(markets[1].id).toBe('huobi_ltc_usd');
                });
        })));

        it('should handle returning no matching Markets', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllMarketsForBotId('unknown')
                .then(markets => expect(markets.length).toBe(0, 'should have no Markets'));
        })));
    });

    describe('when updateMarket() operation called for Huobi', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let response: Response;
        let updatedMarket: Market;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedMarket = new Market('huobi_btc_usd', 'huobi-1', 'BTC/USD', true, 'BTC', 'USD',
                new TradingStrategy('huobi_macd', 'huobi-1', 'MACD Indicator',
                    'MACD Indicator for deciding when to enter and exit trades.',
                    'com.gazbert.bxbot.strategies.MacdStrategy'));

            backend = be;
            service = new MarketDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedMarket}});
            response = new Response(options);
        }));

        it('should return updated Huobi Market on success', async(inject([], () => {
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
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateMarket(updatedMarket)
                .then(market => expect(market.id).not.toBeDefined('should have no Market'));
        })));
    });

    describe('when deleteMarketById() operation called with \'huobi_btc_usd\'', () => {

        let backend: MockBackend;
        let service: MarketDataService;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new MarketDataService(http);
            const options = new ResponseOptions({status: 200});
            response = new Response(options);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.deleteMarketById('huobi_btc_usd')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteMarketById('unknown')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeMarketData = () => [

    new Market('huobi_btc_usd', 'huobi-1', 'BTC/USD', true, 'BTC', 'USD',
        new TradingStrategy('huobi_macd_rsi', 'huobi-1', 'MACD RSI Indicator',
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy')),

    new Market('huobi_ltc_usd', 'huobi-1', 'LTC/USD', true, 'LTC', 'USD',
        new TradingStrategy('huobi_macd', 'huobi-1', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy')),

] as Market[];


