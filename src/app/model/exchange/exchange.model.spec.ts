import {Exchange, NetworkConfig, OptionalConfig} from './exchange.model';

/**
 * Tests the Exchange model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange model tests', () => {

    it('should have correct initial values', () => {
        const exchange = new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
            new NetworkConfig(60,
                [
                    503,
                    504,
                    522,
                ],
                [
                    'Connection reset',
                    'Connection refused',
                    'Remote host closed connection during handshake'
                ]
            ),
            new OptionalConfig([
                    {
                        name: 'buy-fee',
                        value: '0.2'
                    },
                    {
                        name: 'sell-fee',
                        value: '0.25'
                    }
                ]
            ));

        expect(exchange.id).toBe('gdax');
        expect(exchange.name).toBe('GDAX');
        expect(exchange.adapterClass).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(exchange.networkConfig.connectionTimeout).toBe(60);

        expect(exchange.networkConfig.nonFatalHttpStatusCodes[0]).toBe(503);
        expect(exchange.networkConfig.nonFatalHttpStatusCodes[1]).toBe(504);
        expect(exchange.networkConfig.nonFatalHttpStatusCodes[2]).toBe(522);

        expect(exchange.networkConfig.nonFatalErrorMessages[0]).toBe('Connection reset');
        expect(exchange.networkConfig.nonFatalErrorMessages[1]).toBe('Connection refused');
        expect(exchange.networkConfig.nonFatalErrorMessages[2]).toBe('Remote host closed connection during handshake');

        expect(exchange.optionalConfig.configItems[0].name).toBe('buy-fee');
        expect(exchange.optionalConfig.configItems[0].value).toBe('0.2');
        expect(exchange.optionalConfig.configItems[1].name).toBe('sell-fee');
        expect(exchange.optionalConfig.configItems[1].value).toBe('0.25');
    });

    it('should clone itself', () => {
        const exchange = new Exchange('huobi', 'Huobi', 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
            new NetworkConfig(60,
                [
                    503,
                    504,
                    522,
                ],
                [
                    'Connection reset',
                    'Connection refused',
                    'Remote host closed connection during handshake'
                ]
            ),
            new OptionalConfig([
                    {
                        name: 'buy-fee',
                        value: '0.2'
                    },
                    {
                        name: 'sell-fee',
                        value: '0.25'
                    }
                ]
            ));

        const clone = exchange.clone();
        expect(exchange).toEqual(clone);
    });
});
