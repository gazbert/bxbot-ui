import {ExchangeAdapter, NetworkConfig, OtherConfig} from './exchange-adapter.model';

/**
 * Tests the Exchange Adapter model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange Adapter model tests', () => {

    it('should have correct initial values', () => {
        const exchangeAdapter = new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
            new OtherConfig([
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

        expect(exchangeAdapter.id).toBe('gdax');
        expect(exchangeAdapter.name).toBe('GDAX');
        expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(exchangeAdapter.networkConfig.connectionTimeout).toBe(60);

        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).toBe(503);
        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBe(504);
        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[2]).toBe(522);

        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).toBe('Connection reset');
        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe('Connection refused');
        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[2]).toBe('Remote host closed connection during handshake');

        expect(exchangeAdapter.otherConfig.configItems[0].name).toBe('buy-fee');
        expect(exchangeAdapter.otherConfig.configItems[0].value).toBe('0.2');
        expect(exchangeAdapter.otherConfig.configItems[1].name).toBe('sell-fee');
        expect(exchangeAdapter.otherConfig.configItems[1].value).toBe('0.25');
    });

    it('should clone itself', () => {
        const exchangeAdapter = new ExchangeAdapter('huobi', 'Huobi', 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
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
            new OtherConfig([
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

        const clone = exchangeAdapter.clone();
        expect(exchangeAdapter).toEqual(clone);
    });
});
