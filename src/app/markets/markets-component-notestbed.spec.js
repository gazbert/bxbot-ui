"use strict";
var testing_1 = require("../../testing");
var markets_component_1 = require("./markets.component");
var market_1 = require("../model/market");
var trading_strategy_1 = require("../model/trading-strategy");
/**
 * Tests the behaviour of the Markets component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('MarketsComponent tests without TestBed', function () {
    var activatedRoute;
    var marketsComponent;
    var expectedMarkets = [];
    var expectedMarket_1;
    var expectedMarket_2;
    var expectedUpdatedMarket_2;
    var expectedTradingStrategy_1;
    var expectedTradingStrategy_2;
    var spyMarketDataService;
    var spyTradingStrategyDataService;
    var router;
    beforeEach(function (done) {
        expectedTradingStrategy_1 = new trading_strategy_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        expectedMarket_1 = new market_1.Market('gdax_btc_usd', 2, 'BTC/USD', true, 'BTC', 'USD', expectedTradingStrategy_1);
        expectedTradingStrategy_2 = new trading_strategy_1.TradingStrategy('gdax_ema', 2, 'MACD Indicator', 'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');
        expectedMarket_2 = new market_1.Market('gdax_btc_gbp', 2, 'BTC/GBP', true, 'BTC', 'GBP', expectedTradingStrategy_2);
        expectedMarkets = [expectedMarket_1, expectedMarket_2];
        expectedUpdatedMarket_2 = new market_1.Market('gdax_btc_gbp', 2, 'ETH/USD', true, 'ETH', 'USD', expectedTradingStrategy_2);
        activatedRoute = new testing_1.ActivatedRouteStub();
        activatedRoute.testParams = { id: expectedMarket_1.botId };
        router = jasmine.createSpyObj('router', ['navigate']);
        // Just mock this out, not testing it here, has it's own tests suite.
        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategyHttpDataPromiseService', ['getAllTradingStrategiesForBotId']);
        spyTradingStrategyDataService.getAllTradingStrategiesForBotId.and.returnValues(Promise.resolve([]));
        // We are testing this tho...
        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService', ['getAllMarketsForBotId', 'updateMarket']);
        spyMarketDataService.getAllMarketsForBotId.and.returnValue(Promise.resolve(expectedMarkets));
        spyMarketDataService.updateMarket.and.returnValue(Promise.resolve(expectedUpdatedMarket_2));
        marketsComponent = new markets_component_1.MarketsComponent(spyMarketDataService, spyTradingStrategyDataService, activatedRoute, router);
        marketsComponent.ngOnInit();
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue.then(done);
    });
    it('should expose Markets retrieved from MarketDataService', function () {
        expect(marketsComponent.markets).toBe(expectedMarkets);
        // paranoia ;-)
        expect(marketsComponent.markets.length).toBe(2);
        expect(marketsComponent.markets[0].id).toBe('gdax_btc_usd');
    });
    it('should save and navigate to Dashboard when user clicks Save for valid input', function (done) {
        marketsComponent.save(true);
        spyMarketDataService.updateMarket.calls.first().returnValue
            .then(function (updatedMarket) {
            expect(updatedMarket).toBe(expectedUpdatedMarket_2);
            expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
            done();
        });
    });
    it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
        marketsComponent.cancel();
        expect(spyMarketDataService.updateMarket.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });
    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
        marketsComponent.save(false);
        expect(spyMarketDataService.updateMarket.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
    it('should remove Market when user deletes one', function () {
        expect(marketsComponent.markets.length).toBe(2);
        marketsComponent.deleteMarket(expectedMarket_1);
        expect(marketsComponent.markets.length).toBe(1);
        expect(marketsComponent.deletedMarkets.length).toBe(1);
    });
    it('should add new Market when user adds one', function () {
        expect(marketsComponent.markets).toBe(expectedMarkets);
        expect(marketsComponent.markets.length).toBe(2);
        marketsComponent.addMarket();
        expect(marketsComponent.markets.length).toBe(3);
        expect(marketsComponent.markets[2].id).not.toBeNull();
        expect(marketsComponent.markets[2].botId).toBe(2);
        expect(marketsComponent.markets[2].name).toBe(null);
    });
});
//# sourceMappingURL=markets-component-notestbed.spec.js.map