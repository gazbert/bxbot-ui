import {ExchangeAdapter, NetworkConfig} from "../exchange-adapter.model";

/**
 * Dummy Exchange Adapter data for testing.
 */
export var EXCHANGE_ADAPTERS: ExchangeAdapter[] = [

    new ExchangeAdapter('bitstamp', 'bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
        )),
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
        )),
    new ExchangeAdapter('gemini', 'gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
        )),
    new ExchangeAdapter('itbit', 'itbit', 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
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
        )),
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
        )),
    new ExchangeAdapter('okcoin', 'okcoin', 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
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
        )),
    new ExchangeAdapter('bitfinex', 'bitfinex', 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
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
        )),
    new ExchangeAdapter('huobi', 'huobi', 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
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
        )),
    new ExchangeAdapter('kraken', 'kraken', 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
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
        )),
];