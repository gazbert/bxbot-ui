import {OptionalConfig, Strategy} from './strategy.model';

/**
 * Tests the Strategy model behaves as expected.
 *
 * @author gazbert
 */
describe('Strategy model tests', () => {

    it('should have correct initial values', () => {
        const strategy = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([
                    {
                        name: 'ema-short-interval',
                        value: '12'
                    },
                    {
                        name: 'ema-long-interval',
                        value: '26'
                    },
                    {
                        name: 'signal-line',
                        value: '9'
                    }
                ]
            )
        );

        expect(strategy.id).toBe('gdax_macd');
        expect(strategy.botId).toBe('gdax-2');
        expect(strategy.name).toBe('MACD Indicator');
        expect(strategy.description).toBe('MACD Indicator for deciding when to enter and exit trades.');
        expect(strategy.className).toBe('com.gazbert.bxbot.strategies.MacdStrategy');
    });

    it('should clone itself', () => {
        const strategy = new Strategy('gdax_macd', 'gdax-1', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([
                    {
                        name: 'ema-short-interval',
                        value: '12'
                    },
                    {
                        name: 'ema-long-interval',
                        value: '26'
                    },
                    {
                        name: 'signal-line',
                        value: '9'
                    }
                ]
            )
        );

        const clone = strategy.clone();
        expect(strategy).toEqual(clone);
    });
});
