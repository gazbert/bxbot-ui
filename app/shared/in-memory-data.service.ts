import {InMemoryDbService} from "angular-in-memory-web-api";

/**
 * TODO Move this into model folder...
 */
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {
                id: 'Bitstamp',
                adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'GDAX',
                adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'Gemini',
                adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'ItBit',
                adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'BTC-e',
                adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'OKCoin',
                adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'Bitfinex',
                adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'Huobi',
                adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'Kraken',
                adapter: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                    ]
                }
            }
        ];
        return {exchanges};
    }
}
