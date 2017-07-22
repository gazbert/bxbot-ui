"use strict";
var trading_strategy_model_1 = require("./trading-strategy.model");
/**
 * Tests the Trading Strategy model behaves as expected.
 *
 * @author gazbert
 */
describe('Trading Strategy model tests', function () {
    it('should have correct initial values', function () {
        var tradingStrategy = new trading_strategy_model_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        expect(tradingStrategy.id).toBe('gdax_macd');
        expect(tradingStrategy.botId).toBe(2);
        expect(tradingStrategy.name).toBe('MACD Indicator');
        expect(tradingStrategy.description).toBe('MACD Indicator for deciding when to enter and exit trades.');
        expect(tradingStrategy.className).toBe('com.gazbert.bxbot.strategies.MacdStrategy');
    });
    it('should clone itself', function () {
        var tradingStrategy = new trading_strategy_model_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        var clone = tradingStrategy.clone();
        expect(tradingStrategy).toEqual(clone);
    });
});
//# sourceMappingURL=trading-strategy.model.spec.js.map