import {ExchangeAdapter, NetworkConfig} from "./exchange-adapter.model";

/**
 * Tests the Exchange Adapter model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange Adapter model tests', () => {

    it('should have correct initial values', () => {
        const exchangeAdapter = new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter', 1,
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
        expect(exchangeAdapter.name).toBe('GDAX');
        expect(exchangeAdapter.className).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(exchangeAdapter.networkConfig.connectionTimeout).toBe(60);

        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0].value).toBe(503);
        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBe(504);
        expect(exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[2].value).toBe(522);

        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[0].value).toBe("Connection reset");
        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[1].value).toBe("Connection refused");
        expect(exchangeAdapter.networkConfig.nonFatalErrorMessages[2].value).toBe("Remote host closed connection during handshake");
    });

    it('should clone itself', () => {
        const exchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter', 1,
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