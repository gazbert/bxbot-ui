import {InMemoryDbService} from "angular-in-memory-web-api";

/**
 * An in-memory data store for testing the app without the 'real' REST service backend.
 *
 * TODO Add markets, trading strats, email alert info, etc into here... or use separate Dbs ?
 *
 * @author gazbert
 */
export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {
                id: 'bitstamp',
                label: 'Bitstamp',
                adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                    ]
                },
                markets: [
                    {
                        id: 'btc_usd',
                        label: 'BTC/USD',
                        enabled: true,
                        baseCurrency: 'BTC',
                        counterCurrency: 'USD',
                        tradingStrategy: {
                            id: 'macd',
                            label: 'MACD Indicator',
                            description: 'MACD Indicator for deciding when to enter and exit trades.',
                            className: 'com.gazbert.bxbot.strategies.MacdStrategy'
                        }
                    }
                ],
                emailAlertsConfig: {
                    enabled: true,
                    smtpHost: "smtp.gmail.com",
                    smtpPort: 587,
                    accountUsername: 'bobfett',
                    accountPassword: 'iLoveHoth',
                    toAddress: 'jabba@tatooine.space',
                    fromAddress: 'boba.fett@hoth.space'
                }
            },
            {
                id: 'gdax',
                label: 'GDAX',
                adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                },
                markets: [
                    {
                        id: 'btc_usd',
                        label: 'BTC/USD',
                        enabled: false,
                        baseCurrency: 'BTC',
                        counterCurrency: 'USD',
                        tradingStrategy: {
                            id: 'macd',
                            label: 'MACD Indicator',
                            description: 'MACD Indicator for deciding when to enter and exit trades.',
                            className: 'com.gazbert.bxbot.strategies.MacdStrategy'
                        }
                    },
                    {
                        id: 'btc_gbp',
                        label: 'BTC/GBP',
                        enabled: true,
                        baseCurrency: 'BTC',
                        counterCurrency: 'GBP',
                        tradingStrategy: {
                            id: 'long-scalper',
                            label: 'Long Scalper',
                            description: 'Scalping strategy that buys low and sells high.',
                            className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
                        }
                    }
                ],
                emailAlertsConfig: {
                    enabled: true,
                    smtpHost: "smtp.gmail.com",
                    smtpPort: 587,
                    accountUsername: 'bobfett',
                    accountPassword: 'iLoveHoth',
                    toAddress: 'jabba@tatooine.space',
                    fromAddress: 'boba.fett@hoth.space'
                }
            },
            {
                id: 'gemini',
                label: 'Gemini',
                adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'itbit',
                label: 'ItBit',
                adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                    ]
                }
            },
            {
                id: 'btce',
                label: 'BTC-e',
                adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'okcoin',
                label: 'OKCoin',
                adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                    ]
                }
            },
            {
                id: 'bitfinex',
                label: 'Bitfinex',
                adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Remote host closed connection during handshake"}
                    ]
                }
            },
            {
                id: 'huobi',
                label: 'Huobi',
                adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                    ]
                }
            },
            {
                id: 'kraken',
                label: 'Kraken',
                adapter: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Remote host closed connection during handshake"},
                    ]
                }
            }
        ];
        return {exchanges};
    }
}
