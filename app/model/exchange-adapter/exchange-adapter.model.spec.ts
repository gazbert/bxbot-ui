import {ExchangeAdapter, NetworkConfig} from "./exchange-adapter.model";

/**
 * Tests the Exchange Adapter model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange Adapter', () => {

    it('has correct initial values', () => {
        const exchangeAdapter =
            new ExchangeAdapter('gdax', 'gdax', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                new NetworkConfig(60,
                    [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                ));

        expect(exchangeAdapter.id).toBe('gdax');
        expect(exchangeAdapter.exchangeId).toBe('gdax');
        expect(exchangeAdapter.adapter).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        // TODO etc etc ...
    });

    it('can clone itself', () => {
        const exchangeAdapter =
            new ExchangeAdapter('btce', 'btce', 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                new NetworkConfig(60,
                    [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                ));

        const clone = exchangeAdapter.clone();
        expect(exchangeAdapter).toEqual(clone);
    });
});