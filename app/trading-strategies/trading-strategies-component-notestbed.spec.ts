import {ActivatedRouteStub} from '../../testing';
import {TradingStrategiesComponent} from './trading-strategies.component';
import {TradingStrategy} from '../model/trading-strategy';
import {Market} from '../model/market';

/**
 * Tests the behaviour of the Trading Strategies component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('TradingStrategiesComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let tradingStrategiesComponent: TradingStrategiesComponent;

    let expectedTradingStrategies = [];
    let expectedTradingStrategy_1: TradingStrategy;
    let expectedTradingStrategy_2: TradingStrategy;
    let expectedUpdatedTradingStrategy_2: TradingStrategy;
    let unusedTradingStrategy: TradingStrategy;

    let expectedMarkets = [];
    let expectedMarket_1: Market;
    let expectedMarket_2: Market;

    let spyTradingStrategyDataService: any;
    let spyMarketDataService: any;
    let router: any;

    beforeEach(done => {

        expectedTradingStrategy_1 = new TradingStrategy('gdax_macd', 'gdax', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        expectedTradingStrategy_2 = new TradingStrategy('gdax_ema', 'gdax', 'EMA Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');

        unusedTradingStrategy = new TradingStrategy('gdax_not_used', 'gdax', 'EMA Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');

        expectedUpdatedTradingStrategy_2 = new TradingStrategy('gdax_scalper', 'gdax', 'Long Scalper',
            'Scalper that buys low and sells high, like duh.', 'com.gazbert.bxbot.strategies.LongScalper');

        expectedTradingStrategies = [expectedTradingStrategy_1, expectedTradingStrategy_2, unusedTradingStrategy];

        expectedMarket_1 = new Market('gdax_btc_usd', 'gdax', 'BTC/USD', true, 'BTC', 'USD', expectedTradingStrategy_1);
        expectedMarket_2 = new Market('gdax_btc_gbp', 'gdax', 'BTC/GBP', true, 'BTC', 'GBP', expectedTradingStrategy_2);
        expectedMarkets = [expectedMarket_1, expectedMarket_2];

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedTradingStrategy_1.exchangeId};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategiesHttpDataPromiseService',
            ['getAllTradingStrategiesForExchange', 'updateTradingStrategy', 'deleteTradingStrategyById']);
        spyTradingStrategyDataService.getAllTradingStrategiesForExchange.and.returnValue(Promise.resolve(expectedTradingStrategies));
        spyTradingStrategyDataService.updateTradingStrategy.and.returnValue(Promise.resolve(expectedUpdatedTradingStrategy_2));

        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService', ['getAllMarketsForExchange']);
        spyMarketDataService.getAllMarketsForExchange.and.returnValue(Promise.resolve(expectedMarkets));

        tradingStrategiesComponent = new TradingStrategiesComponent(spyTradingStrategyDataService, spyMarketDataService,
            <any> activatedRoute, router);

        tradingStrategiesComponent.ngOnInit();

        // OnInit calls TradingStrategiesComponent.getAllTradingStrategiesForExchange; wait for it to get the exchanges
        spyTradingStrategyDataService.getAllTradingStrategiesForExchange.calls.first().returnValue.then(done);
    });

    it('should expose Trading Strategies retrieved from TradingStrategyDataService', () => {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);

        // paranoia ;-)
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        expect(tradingStrategiesComponent.tradingStrategies[0].id).toBe('gdax_macd');
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        tradingStrategiesComponent.save(true);
        spyTradingStrategyDataService.updateTradingStrategy.calls.first().returnValue
            .then((updatedStrategy) => {
                expect(updatedStrategy).toBe(expectedUpdatedTradingStrategy_2);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        tradingStrategiesComponent.cancel();
        expect(spyTradingStrategyDataService.updateTradingStrategy.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        tradingStrategiesComponent.save(false);
        expect(spyTradingStrategyDataService.updateTradingStrategy.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should NOT remove Trading Strategy currently being used by a Market', (done) => {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(expectedTradingStrategy_1); // being used
        spyMarketDataService.getAllMarketsForExchange.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
                expect(tradingStrategiesComponent.deletedTradingStrategies.length).toBe(0);
                done();
            });
    });

    it('should remove Trading Strategy not being used by a Market', (done) => {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(unusedTradingStrategy);
        spyMarketDataService.getAllMarketsForExchange.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(tradingStrategiesComponent.tradingStrategies.length).toBe(2);
                expect(tradingStrategiesComponent.deletedTradingStrategies.length).toBe(1);
                done();
            });
    });

    it('should add new Trading Strategy', () => {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);

        tradingStrategiesComponent.addTradingStrategy();
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(4);
        expect(tradingStrategiesComponent.tradingStrategies[3].id).not.toBeNull();
        expect(tradingStrategiesComponent.tradingStrategies[3].exchangeId).toBe('gdax');
        expect(tradingStrategiesComponent.tradingStrategies[3].name).toBe(null);
    });
});
