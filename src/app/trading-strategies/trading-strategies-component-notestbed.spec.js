"use strict";
var testing_1 = require("../../testing");
var trading_strategies_component_1 = require("./trading-strategies.component");
var trading_strategy_1 = require("../model/trading-strategy");
var market_1 = require("../model/market");
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
describe('TradingStrategiesComponent tests without TestBed', function () {
    var activatedRoute;
    var tradingStrategiesComponent;
    var expectedTradingStrategies = [];
    var expectedTradingStrategy_1;
    var expectedTradingStrategy_2;
    var expectedUpdatedTradingStrategy_2;
    var unusedTradingStrategy;
    var expectedMarkets = [];
    var expectedMarket_1;
    var expectedMarket_2;
    var spyTradingStrategyDataService;
    var spyMarketDataService;
    var router;
    beforeEach(function (done) {
        expectedTradingStrategy_1 = new trading_strategy_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        expectedTradingStrategy_2 = new trading_strategy_1.TradingStrategy('gdax_ema', 2, 'EMA Indicator', 'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');
        unusedTradingStrategy = new trading_strategy_1.TradingStrategy('gdax_not_used', 2, 'EMA Indicator', 'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');
        expectedUpdatedTradingStrategy_2 = new trading_strategy_1.TradingStrategy('gdax_scalper', 2, 'Long Scalper', 'Scalper that buys low and sells high, like duh.', 'com.gazbert.bxbot.strategies.LongScalper');
        expectedTradingStrategies = [expectedTradingStrategy_1, expectedTradingStrategy_2, unusedTradingStrategy];
        expectedMarket_1 = new market_1.Market('gdax_btc_usd', 2, 'BTC/USD', true, 'BTC', 'USD', expectedTradingStrategy_1);
        expectedMarket_2 = new market_1.Market('gdax_btc_gbp', 2, 'BTC/GBP', true, 'BTC', 'GBP', expectedTradingStrategy_2);
        expectedMarkets = [expectedMarket_1, expectedMarket_2];
        activatedRoute = new testing_1.ActivatedRouteStub();
        activatedRoute.testParams = { id: expectedTradingStrategy_1.botId };
        router = jasmine.createSpyObj('router', ['navigate']);
        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategiesHttpDataPromiseService', ['getAllTradingStrategiesForBotId', 'updateTradingStrategy', 'deleteTradingStrategyById']);
        spyTradingStrategyDataService.getAllTradingStrategiesForBotId.and.returnValue(Promise.resolve(expectedTradingStrategies));
        spyTradingStrategyDataService.updateTradingStrategy.and.returnValue(Promise.resolve(expectedUpdatedTradingStrategy_2));
        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService', ['getAllMarketsForBotId']);
        spyMarketDataService.getAllMarketsForBotId.and.returnValue(Promise.resolve(expectedMarkets));
        tradingStrategiesComponent = new trading_strategies_component_1.TradingStrategiesComponent(spyTradingStrategyDataService, spyMarketDataService, activatedRoute, router);
        tradingStrategiesComponent.ngOnInit();
        // OnInit calls TradingStrategiesComponent.getAllTradingStrategiesForExchange; wait for it to get the exchanges
        spyTradingStrategyDataService.getAllTradingStrategiesForBotId.calls.first().returnValue.then(done);
    });
    it('should expose Trading Strategies retrieved from TradingStrategyDataService', function () {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);
        // paranoia ;-)
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        expect(tradingStrategiesComponent.tradingStrategies[0].id).toBe('gdax_macd');
    });
    it('should save and navigate to Dashboard when user clicks Save for valid input', function (done) {
        tradingStrategiesComponent.save(true);
        spyTradingStrategyDataService.updateTradingStrategy.calls.first().returnValue
            .then(function (updatedStrategy) {
            expect(updatedStrategy).toBe(expectedUpdatedTradingStrategy_2);
            expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
            done();
        });
    });
    it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
        tradingStrategiesComponent.cancel();
        expect(spyTradingStrategyDataService.updateTradingStrategy.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });
    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
        tradingStrategiesComponent.save(false);
        expect(spyTradingStrategyDataService.updateTradingStrategy.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
    it('should NOT remove Trading Strategy currently being used by a Market', function (done) {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(expectedTradingStrategy_1); // being used
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then(function (markets) {
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
    it('should remove Trading Strategy not being used by a Market', function (done) {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(unusedTradingStrategy);
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then(function (markets) {
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
    it('should add new Trading Strategy', function () {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.addTradingStrategy();
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(4);
        expect(tradingStrategiesComponent.tradingStrategies[3].id).not.toBeNull();
        expect(tradingStrategiesComponent.tradingStrategies[3].botId).toBe(2);
        expect(tradingStrategiesComponent.tradingStrategies[3].name).toBe(null);
    });
});
//# sourceMappingURL=trading-strategies-component-notestbed.spec.js.map