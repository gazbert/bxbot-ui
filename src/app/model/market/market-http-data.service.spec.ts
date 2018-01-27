import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {MarketHttpDataService as MarketDataService} from './market-http-data.service';
import {OptionalConfig, Strategy} from '../strategy';
import {Market} from './market.model';

/**
 * Tests the Market HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('MarketHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [MarketDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getAllMarketsForBotId() operation called with \'huobi-1\'', () => {

        let backend: HttpTestingController;
        let service: MarketDataService;
        let markets: Market[];

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new MarketDataService(http);
            markets = makeMarketData();
        }));

        it('should return 2 Huobi Markets', async(inject([], () => {

            service.getAllMarketsForBotId('huobi-1')
                .then(response => {

                    expect(response).toBe(markets);

                    // paranoia!
                    expect(markets[0].id).toBe('huobi_btc_usd');
                    expect(markets[1].id).toBe('huobi_ltc_usd');
                });

            backend.expectOne({
                url: 'app/markets?botId=huobi-1',
                method: 'GET'
            }).flush(markets, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no matching Markets', async(inject([], () => {

            service.getAllMarketsForBotId('gdax-unknown')
                .then(response => {
                    expect(response.length).toBe(0);
                });

            backend.expectOne({
                url: 'app/markets?botId=gdax-unknown',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when updateMarket() operation called for Huobi', () => {

        let backend: HttpTestingController;
        let service: MarketDataService;
        let updatedMarket: Market;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {

            updatedMarket = new Market('huobi_btc_usd', 'huobi-1', 'BTC/USD', true, 'BTC', 'USD',
                new Strategy('huobi_macd', 'huobi-1', 'MACD Indicator',
                    'MACD Indicator for deciding when to enter and exit trades.',
                    'com.gazbert.bxbot.strategies.MacdStrategy', new OptionalConfig([])));

            backend = testController;
            service = new MarketDataService(http);
        }));

        it('should return updated Huobi Market on success', async(inject([], () => {

            service.updateMarket('huobi-1', updatedMarket)
                .then(response => {
                    expect(response).toBe(updatedMarket);

                    // paranoia!
                    expect(response.name).toBe('BTC/USD');
                });

            backend.expectOne({
                url: 'app/markets/huobi_btc_usd',
                method: 'PUT'
            }).flush(updatedMarket, {status: 200, statusText: 'Ok'});

        })));

        it('should NOT return updated Market for unknown marketId', async(inject([], () => {

            const unknownMarket = new Market('unknown-market-id', 'huobi-1', 'BTC/USD', true,
                'BTC', 'USD',
                new Strategy('huobi_macd', 'huobi-1', 'MACD Indicator',
                    'MACD Indicator for deciding when to enter and exit trades.',
                    'com.gazbert.bxbot.strategies.MacdStrategy', new OptionalConfig([])));

            service.updateMarket('unknown-id', unknownMarket)
                .then(response => {
                    expect(response.name).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/markets/unknown-market-id',
                method: 'PUT'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });

    describe('when deleteMarketById() operation called with \'huobi_btc_usd\'', () => {

        let backend: HttpTestingController;
        let service: MarketDataService;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new MarketDataService(http);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {

            service.deleteMarketById('huobi-1', 'huobi_btc_usd')
                .then(response => {
                    expect(response).toEqual(true);
                });

            backend.expectOne({
                url: 'app/markets/huobi_btc_usd',
                method: 'DELETE'
            }).flush({status: 200, statusText: 'Ok'});

        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {

            service.deleteMarketById('huobi-1', 'gdax-unknown')
                .then(() => {
                        fail('Should have failed with 404 response');
                    },
                    (error) => {
                        expect(error).toBe('Bad response status: 404');
                    });

            backend.expectOne({
                url: 'app/markets/gdax-unknown',
                method: 'DELETE'
            }).flush({status: 404, statusText: 'Not Found'});

        })));

    });
});

const makeMarketData = () => [

    new Market('huobi_btc_usd', 'huobi-1', 'BTC/USD', true, 'BTC', 'USD',
        new Strategy('huobi_macd', 'huobi-1', 'MACD Indicator',
            'MACD Indicator algo for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdRsiStrategy', new OptionalConfig([]))),

    new Market('huobi_ltc_usd', 'huobi-1', 'LTC/USD', true, 'LTC', 'USD',
        new Strategy('huobi_macd', 'huobi-1', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.',
            'com.gazbert.bxbot.strategies.MacdStrategy', new OptionalConfig([]))),

] as Market[];


