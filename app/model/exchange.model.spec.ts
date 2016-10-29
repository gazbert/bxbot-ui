import {Exchange, NetworkConfig} from "./exchange.model";

/**
 * Tests the Exchange model behaves as expected.
 *
 * TODO Boost coverage
 *
 * @author gazbert
 */
describe('Exchange', () => {

    it('has correct initial values', () => {
        const exchange =
            new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
                ),
                null,
                null);

        expect(exchange.id).toBe('gdax');
        expect(exchange.adapter).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');

        // TODO etc etc ...
    });

    it('can clone itself', () => {
        const exchange =
            new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
                ),
                null,
                null);

        const clone = exchange.clone();
        expect(exchange).toEqual(clone);
    });
});