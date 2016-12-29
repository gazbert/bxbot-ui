import {ActivatedRouteStub} from '../../testing';
import {MarketsComponent} from './markets.component';
import {Market} from '../model/market';
import {TradingStrategy} from '../model/trading-strategy';

/**
 * Tests the behaviour of the Markets component is as expected.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO When should I/should I not use the testbed?
 * TODO Increase coverage for the form input + validation, adding/updating/deleting Markets.
 *
 * @author gazbert
 */
describe('MarketsComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let marketsComponent: MarketsComponent;

    let expectedMarkets = [];
    let expectedMarket_1: Market;
    let expectedMarket_2: Market;
    let expectedTradingStrategy_1: TradingStrategy;
    let expectedTradingStrategy_2: TradingStrategy;

    let spyMarketDataService: any;
    let spyTradingStrategyDataService: any;
    let router: any;

    beforeEach(done => {

        expectedTradingStrategy_1 = new TradingStrategy('gdax_macd', 'gdax', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        expectedMarket_1 = new Market('gdax_btc_usd', 'gdax', 'BTC/USD', true, 'BTC', 'USD', expectedTradingStrategy_1);

        expectedTradingStrategy_2 = new TradingStrategy('gdax_ema', 'gdax', 'MACD Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');
        expectedMarket_2 = new Market('gdax_btc_gbp', 'gdax', 'BTC/GBP', true, 'BTC', 'GBP', expectedTradingStrategy_2);

        expectedMarkets = [expectedMarket_1, expectedMarket_2];

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedMarket_1.exchangeId};

        router = jasmine.createSpyObj('router', ['navigate']);

        // Just mock this out, not testing it here, has it's own tests suite.
        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategyHttpDataPromiseService',
            ['getAllTradingStrategiesForExchange']);
        spyTradingStrategyDataService.getAllTradingStrategiesForExchange.and.returnValues(Promise.resolve([]));

        // We are testing this tho...
        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService',
            ['getAllMarketsForExchange', 'updateMarket']);
        spyMarketDataService.getAllMarketsForExchange.and.returnValue(Promise.resolve(expectedMarkets));
        spyMarketDataService.updateMarket.and.returnValue(Promise.resolve(expectedMarket_1));

        marketsComponent = new MarketsComponent(spyMarketDataService, spyTradingStrategyDataService, <any> activatedRoute, router);
        marketsComponent.ngOnInit();

        spyMarketDataService.getAllMarketsForExchange.calls.first().returnValue.then(done);
    });

    it('should expose the Markets retrieved from the service', () => {
        expect(marketsComponent.markets).toBe(expectedMarkets);

        // paranoia ;-)
        expect(marketsComponent.markets.length).toBe(2);
        expect(marketsComponent.markets[0].id).toBe('gdax_btc_usd');
    });

    it('should navigate when click Cancel', () => {
        marketsComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    // TODO Test update on only 1 market
    it('should save when click Save for valid input', () => {
        marketsComponent.save(true);
        expect(spyMarketDataService.updateMarket.calls.any()).toBe(true, 'MarketDataService.save called');
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate not called yet');
    });

    it('should NOT save when click Save for invalid input', () => {
        marketsComponent.save(false);
    });

    it('should navigate when click Save resolves', done => {
        marketsComponent.save(true);

        // waits for async save to complete before navigating
        spyMarketDataService.updateMarket.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});
