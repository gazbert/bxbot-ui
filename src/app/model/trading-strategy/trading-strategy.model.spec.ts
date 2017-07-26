import {TradingStrategy} from './trading-strategy.model';

/**
 * Tests the Trading Strategy model behaves as expected.
 *
 * @author gazbert
 */
describe('Trading Strategy model tests', () => {

    it('should have correct initial values', () => {
        const tradingStrategy = new TradingStrategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');

        expect(tradingStrategy.id).toBe('gdax_macd');
        expect(tradingStrategy.botId).toBe('gdax-2');
        expect(tradingStrategy.name).toBe('MACD Indicator');
        expect(tradingStrategy.description).toBe('MACD Indicator for deciding when to enter and exit trades.');
        expect(tradingStrategy.className).toBe('com.gazbert.bxbot.strategies.MacdStrategy');
    });

    it('should clone itself', () => {
        const tradingStrategy = new TradingStrategy('gdax_macd', 'gdax-1', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');

        const clone = tradingStrategy.clone();
        expect(tradingStrategy).toEqual(clone);
    });
});
