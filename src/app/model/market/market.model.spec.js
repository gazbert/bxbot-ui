"use strict";
var market_model_1 = require("./market.model");
var trading_strategy_model_1 = require("../trading-strategy/trading-strategy.model");
/**
 * Tests the Market model behaves as expected.
 *
 * @author gazbert
 */
describe('Market model tests', function () {
    it('should have correct initial values', function () {
        var tradingStrategy = new trading_strategy_model_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        var market = new market_model_1.Market('gdax_btc_usd', 2, 'BTC/USD', true, 'BTC', 'USD', tradingStrategy);
        expect(market.id).toBe('gdax_btc_usd');
        expect(market.botId).toBe(2);
        expect(market.name).toBe('BTC/USD');
        expect(market.enabled).toBe(true);
        expect(market.baseCurrency).toBe('BTC');
        expect(market.counterCurrency).toBe('USD');
        expect(market.tradingStrategy).toBe(tradingStrategy);
    });
    it('should clone itself', function () {
        var tradingStrategy = new trading_strategy_model_1.TradingStrategy('gdax_macd', 2, 'MACD Indicator', 'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        var market = new market_model_1.Market('gdax_btc_usd', 2, 'BTC/USD', true, 'BTC', 'USD', tradingStrategy);
        var clone = market.clone();
        expect(market).toEqual(clone);
    });
});
//# sourceMappingURL=market.model.spec.js.map