import {Market} from "./market.model";
import {TradingStrategy} from "../trading-strategy/trading-strategy.model";

/**
 * Tests the Market model behaves as expected.
 *
 * @author gazbert
 */
describe('Market config', () => {

    it('has correct initial values', () => {
        const tradingStrategy = new TradingStrategy('gdax_macd', 'gdax', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        const market = new Market('gdax_btc_usd', 'gdax', 'BTC/USD', true, 'BTC', 'USD', tradingStrategy);

        expect(market.id).toBe('gdax_btc_usd');
        expect(market.exchangeId).toBe('gdax');
        expect(market.name).toBe('BTC/USD');
        expect(market.enabled).toBe(true);
        expect(market.baseCurrency).toBe('BTC');
        expect(market.counterCurrency).toBe('USD');
        expect(market.tradingStrategy).toBe(tradingStrategy);
    });

    it('can clone itself', () => {
        const tradingStrategy = new TradingStrategy('gdax_macd', 'gdax', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');
        const market = new Market('gdax_btc_usd', 'gdax', 'BTC/USD', true, 'BTC', 'USD', tradingStrategy);

        const clone = market.clone();
        expect(market).toEqual(clone);
    });
});