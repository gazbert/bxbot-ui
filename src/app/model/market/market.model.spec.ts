import {Market} from './market.model';
import {OptionalConfig, Strategy} from '../strategy/strategy.model';

/**
 * Tests the Market model behaves as expected.
 *
 * @author gazbert
 */
describe('Market model tests', () => {

    it('should have correct initial values', () => {

        const strategy = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([]));

        const market = new Market('gdax_btc_usd', 'gdax-1', 'BTC/USD', true, 'BTC', 'USD', strategy);

        expect(market.id).toBe('gdax_btc_usd');
        expect(market.botId).toBe('gdax-1');
        expect(market.name).toBe('BTC/USD');
        expect(market.enabled).toBe(true);
        expect(market.baseCurrency).toBe('BTC');
        expect(market.counterCurrency).toBe('USD');
        expect(market.strategy).toBe(strategy);
    });

    it('should clone itself', () => {

        const strategy = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([]));

        const market = new Market('gdax_btc_usd', 'gdax-2', 'BTC/USD', true, 'BTC', 'USD', strategy);

        const clone = market.clone();
        expect(market).toEqual(clone);
    });
});
