import {InMemoryDbService} from 'angular-in-memory-web-api';

/**
 * An in-memory data store for testing the app without the 'real' REST backend.
 *
 * @author gazbert
 */
export class InMemoryDataService implements InMemoryDbService {

    createDb() {

        /**
         * The Bots.
         */
        const bots = [
            {
                id: 'bitstamp-1',
                name: 'Bitstamp',
                status: 'Running'
            },
            {
                id: 'gdax-1',
                name: 'GDAX',
                status: 'Running'
            },
            {
                id: 'gemini-1',
                name: 'Gemini',
                status: 'Stopped'
            },
            {
                id: 'itbit-1',
                name: 'ItBit',
                status: 'Running'
            },
            {
                id: 'huobi-1',
                name: 'Huobi',
                status: 'Running'
            },
            {
                id: 'okcoin-1',
                name: 'OKCoin',
                status: 'Running'
            },
            {
                id: 'bitfinex-1',
                name: 'Bitfinex',
                status: 'Stopped'
            },
            {
                id: 'kraken-1',
                name: 'Kraken',
                status: 'Running'
            }
        ];

        /**
         * The Trading Engines.
         * There is a 1-1 relationship with the bot - backend server will always set 'id' to the same as the Bot 'id'.
         */
        const engines = [
            {
                id: 'bitstamp-1',
                botName: 'Bitstamp',
                tradingCycleInterval: 30,
                emergencyStopCurrency: 'BTC',
                emergencyStopBalance: 0.5
            },
            {
                id: 'gdax-1',
                botName: 'GDAX',
                tradingCycleInterval: 10,
                emergencyStopCurrency: 'BTC',
                emergencyStopBalance: 0.8
            },
            {
                id: 'gemini-1',
                botName: 'Gemini',
                tradingCycleInterval: 30,
                emergencyStopCurrency: 'ETH',
                emergencyStopBalance: 10.5
            },
            {
                id: 'itbit-1',
                botName: 'ItBit',
                tradingCycleInterval: 10,
                emergencyStopCurrency: 'XBT',
                emergencyStopBalance: 3.1
            },
            {
                id: 'huobi-1',
                botName: 'Huobi',
                tradingCycleInterval: 120,
                emergencyStopCurrency: 'BTC',
                emergencyStopBalance: 0.9
            },
            {
                id: 'okcoin-1',
                botName: 'OKCoin',
                tradingCycleInterval: 60,
                emergencyStopCurrency: 'BTC',
                emergencyStopBalance: 2.1
            },
            {
                id: 'bitfinex-1',
                botName: 'Bitfinex',
                tradingCycleInterval: 3600,
                emergencyStopCurrency: 'BTC',
                emergencyStopBalance: 5.5
            },
            {
                id: 'kraken-1',
                botName: 'Kraken',
                tradingCycleInterval: 360,
                emergencyStopCurrency: 'XBT',
                emergencyStopBalance: 7.5
            }
        ];

        /**
         * The Exchange Adapters.
         * There is a 1-1 relationship with the bot - backend server will always set 'id' to the same as the Bot 'id'.
         */
        const exchange_adapters = [
            {
                id: 'bitstamp-1',
                name: 'Bitstamp REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Connection refused'
                    ]
                },
                optionalConfig: {
                    configItems: []
                }
            },
            {
                id: 'gdax-1',
                name: 'GDAX REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Connection refused'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.25'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.25'
                        }
                    ]
                }
            },
            {
                id: 'gemini-1',
                name: 'Gemini REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        504
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Remote host closed connection during handshake'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.25'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.25'
                        }
                    ]
                }
            },
            {
                id: 'itbit-1',
                name: 'ItBit REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Connection refused'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.2'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.2'
                        }
                    ]
                }
            },
            {
                id: 'huobi-1',
                name: 'Huobi API Adapter',
                className: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [
                        504,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Remote host closed connection during handshake'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.2'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.2'
                        }
                    ]
                }
            },
            {
                id: 'okcoin-1',
                name: 'OKCoin REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        504
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Connection refused'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.25'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.25'
                        }
                    ]
                }
            },
            {
                id: 'bitfinex-1',
                name: 'Bitfinex REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [
                        504,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Remote host closed connection during handshake'
                    ]
                },
                optionalConfig: {
                    configItems: []
                }
            },
            {
                id: 'kraken-1',
                name: 'Kraken REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        504,
                        522
                    ],
                    nonFatalErrorMessages: [
                        'Remote host closed connection during handshake'
                    ]
                },
                optionalConfig: {
                    configItems: [
                        {
                            name: 'buy-fee',
                            value: '0.26'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.26'
                        }
                    ]
                }
            }
        ];

        /**
         * The Markets being trading on.
         * The 'id' field is required because we cannot rely on the marketId being unique across different Exchanges -
         * it is often the same. e.g. btcusd
         */
        const markets = [
            {
                id: 'bitstamp_btc_usd',
                botId: 'bitstamp-1',
                marketId: 'btcusd',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'bitstamp_ema',
                    exchangeId: 'bitstamp',
                    name: 'EMA Indicator',
                    description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaStrategy'
                }
            },
            {
                id: 'gdax_btc_usd',
                botId: 'gdax-1',
                marketId: 'BTC-USD',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'gdax_ema',
                    exchangeId: 'gdax',
                    name: 'EMA Indicator',
                    description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaStrategy'
                }
            },
            {
                id: 'gdax_btc_gbp',
                botId: 'gdax-1',
                marketId: 'BTC-GBP',
                name: 'BTC/GBP',
                enabled: true,
                baseCurrency: 'BTC',
                counterCurrency: 'GBP',
                tradingStrategy: {
                    id: 'gdax_long-scalper',
                    exchangeId: 'gdax',
                    name: 'Long Scalper',
                    description: 'Scalping strategy that buys low and sells high.',
                    className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
                }
            },
            {
                id: 'gemini_eth_btc',
                botId: 'gemini-1',
                marketId: 'ethbtc',
                name: 'ETH/BTC',
                enabled: false,
                baseCurrency: 'ETH',
                counterCurrency: 'BTC',
                tradingStrategy: {
                    id: 'gemini_macd',
                    exchangeId: 'gemini',
                    name: 'MACD Indicator',
                    description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdStrategy'
                }
            },
            {
                id: 'itbit_xbt_usd',
                botId: 'itbit-1',
                marketId: 'XBTUSD',
                name: 'XBT/USD',
                enabled: false,
                baseCurrency: 'XBT',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'itbit_macd',
                    exchangeId: 'itbit',
                    name: 'MACD Indicator',
                    description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdStrategy'
                }
            },
            {
                id: 'huobi_btc_usd',
                botId: 'huobi-1',
                marketId: 'BTC-USD',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'huobi_macd',
                    exchangeId: 'huobi',
                    name: 'MACD Indicator',
                    description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdStrategy'
                }
            },
            {
                id: 'huobi_ltc_usd',
                botId: 'huobi-1',
                marketId: 'BTC-LTC',
                name: 'LTC/USD',
                enabled: true,
                baseCurrency: 'LTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'huobi_long-scalper',
                    exchangeId: 'huobi',
                    name: 'Long Scalper',
                    description: 'Scalping strategy that buys low and sells high.',
                    className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
                }
            },
            {
                id: 'okcoin_btc_usd',
                botId: 'okcoin-1',
                marketId: 'okcoin_btc_usd',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'okcoin_ema',
                    exchangeId: 'okcoin',
                    name: 'MACD Indicator',
                    description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaStrategy'
                }
            },
            {
                id: 'bitfinex_btc_usd',
                botId: 'bitfinex-1',
                marketId: 'btcusd',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'bitfinex_long-scalper',
                    exchangeId: 'bitfinex',
                    name: 'Long Scalper',
                    description: 'Scalping strategy that buys low and sells high.',
                    className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
                }
            },
            {
                id: 'kraken_xbt_usd',
                botId: 'kraken-1',
                marketId: 'XBTUSD',
                name: 'XBT/USD',
                enabled: false,
                baseCurrency: 'XXBT',
                counterCurrency: 'ZUSD',
                tradingStrategy: {
                    id: 'kraken_ema',
                    exchangeId: 'kraken',
                    name: 'EMA Indicator',
                    description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaStrategy'
                }
            }
        ];

        /**
         * The Trading Strategies being executed.
         */
        const trading_strategies = [
            {
                id: 'huobi_macd',
                botId: 'huobi-1',
                name: 'MACD Indicator',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy',
                optionalConfig: {
                    configItems: [
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
                }
            },
            {
                id: 'huobi_long-scalper',
                botId: 'huobi-1',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '0.5'
                        }
                    ]
                }
            },
            {
                id: 'huobi_short-scalper',
                botId: 'huobi-1',
                name: 'Short Scalper',
                description: 'Scalping strategy that sells and buys back more units at lower price.',
                className: 'com.gazbert.bxbot.strategies.ShortScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '0.5'
                        }
                    ]
                }
            },
            {
                id: 'gdax_long-scalper',
                botId: 'gdax-1',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '1.0'
                        }
                    ]
                }
            },
            {
                id: 'gdax_ema',
                botId: 'gdax-1',
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'ema-short-interval',
                            value: '5'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '20'
                        }
                    ]
                }
            },
            {
                id: 'bitstamp_ema',
                botId: 'bitstamp-1',
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'ema-short-interval',
                            value: '10'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '20'
                        }
                    ]
                }
            },
            {
                id: 'gemini_macd',
                botId: 'gemini-1',
                name: 'MACD Indicator',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy',
                optionalConfig: {
                    configItems: [
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
                }
            },
            {
                id: 'gemini_long-scalper',
                botId: 'gemini-1',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '0.75'
                        }
                    ]
                }
            },
            {
                id: 'okcoin_ema',
                botId: 'okcoin-1',
                name: 'MACD Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'ema-short-interval',
                            value: '10'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '20'
                        }
                    ]
                }
            },
            {
                id: 'bitfinex_long-scalper',
                botId: 'bitfinex-1',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '1.75'
                        }
                    ]
                }
            },
            {
                id: 'kraken_ema',
                botId: 'kraken-1',
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'ema-short-interval',
                            value: '10'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '20'
                        }
                    ]
                }
            },
            {
                id: 'itbit_long-scalper',
                botId: 'itbit-1',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy',
                optionalConfig: {
                    configItems: [
                        {
                            name: 'min-percentage-gain',
                            value: '1.0'
                        }
                    ]
                }
            },
            {
                id: 'itbit_macd',
                botId: 'itbit-1',
                name: 'MACD Indicator',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy',
                optionalConfig: {
                    configItems: [
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
                }
            },
        ];

        /**
         * The Email Alerts config for bots to send alert messages.
         * There is a 1-1 relationship with the bot - backend server will always set 'id' to the same as the Bot 'id'.
         */
        const email_alerts = [
            {
                id: 'bitstamp-1',
                enabled: false,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'bobfett',
                accountPassword: 'iLoveHoth',
                toAddress: 'jabba@tatooine.space',
                fromAddress: 'boba.fett@hoth.space'
            },
            {
                id: 'gdax-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'solo',
                accountPassword: 'NeverTellMeTheOdds_',
                toAddress: 'lando@cloudcity.space',
                fromAddress: 'han.solo@falcon.space'
            },
            {
                id: 'gemini-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'c3po',
                accountPassword: 'ohMy',
                toAddress: 'bb-8@jakku.space',
                fromAddress: 'c-3p0@naboo.space',
            },
            {
                id: 'itbit-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'gold5',
                accountPassword: 'stayOnTarget',
                toAddress: 'chewy@kashyyyk.space',
                fromAddress: 'gold5@x-wing.space'
            },
            {
                id: 'huobi-1',
                enabled: false,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'ackbar-1',
                accountPassword: 'ItsATrap#',
                toAddress: 'leia@alderaan.space',
                fromAddress: 'admiral.ackbar@some-one.space'
            },
            {
                id: 'okcoin-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'yoda',
                accountPassword: 'DoOrDoNotThereIsNoTry£',
                toAddress: 'r2d2@naboo.space',
                fromAddress: 'master.yoda@dagobah.space',
            },
            {
                id: 'bitfinex-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'obiwan',
                accountPassword: '@UseTheForceLuke',
                toAddress: 'luke.skywalker@tatooine.space',
                fromAddress: 'Obi.Wan@coruscant.space',
            },
            {
                id: 'kraken-1',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'darthvader',
                accountPassword: 'TheForceIsStrongWithThisOne',
                toAddress: 'boba.fett@hoth.space',
                fromAddress: 'darth@deathstar.space'
            }
        ];

        return {bots, engines, exchange_adapters, markets, trading_strategies, email_alerts};
    }
}
