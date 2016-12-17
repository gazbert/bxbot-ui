import {InMemoryDbService} from 'angular-in-memory-web-api';

/**
 * An in-memory data store for testing the app without the 'real' REST backend.
 *
 * @author gazbert
 */
export class InMemoryDataService implements InMemoryDbService {

    createDb() {

        /**
         * The Exchanges the bots are running on.
         */
        let exchanges = [
            {
                id: 'bitstamp',
                label: 'Bitstamp',
                status: 'Running'
            },
            {
                id: 'gdax',
                label: 'GDAX',
                status: 'Running'
            },
            {
                id: 'gemini',
                label: 'Gemini',
                status: 'Stopped'
            },
            {
                id: 'itbit',
                label: 'ItBit',
                status: 'Running'
            },
            {
                id: 'btce',
                label: 'BTC-e',
                status: 'Running'
            },
            {
                id: 'okcoin',
                label: 'OKCoin',
                status: 'Running'
            },
            {
                id: 'bitfinex',
                label: 'Bitfinex',
                status: 'Stopped'
            },
            {
                id: 'huobi',
                label: 'Huobi',
                status: 'Stopped'
            },
            {
                id: 'kraken',
                label: 'Kraken',
                status: 'Running'
            }
        ];

        /**
         * The Exchange Adapters for integrating with the Exchanges.
         */
        let exchangeAdapters = [
            {
                id: 'bitstamp',
                exchangeId: 'bitstamp',
                adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Connection refused'},
                    ]
                }
            },
            {
                id: 'gdax',
                exchangeId: 'gdax',
                adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Remote host closed connection during handshake'}
                    ]
                }
            },
            {
                id: 'gemini',
                exchangeId: 'gemini',
                adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Remote host closed connection during handshake'}
                    ]
                }
            },
            {
                id: 'itbit',
                exchangeId: 'itbit',
                adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Connection refused'},
                    ]
                }
            },
            {
                id: 'btce',
                exchangeId: 'btce',
                adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Remote host closed connection during handshake'}
                    ]
                }
            },
            {
                id: 'okcoin',
                exchangeId: 'okcoin',
                adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Connection refused'},
                    ]
                }
            },
            {
                id: 'bitfinex',
                exchangeId: 'bitfinex',
                adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Remote host closed connection during handshake'}
                    ]
                }
            },
            {
                id: 'huobi',
                exchangeId: 'huobi',
                adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 504},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Connection refused'},
                    ]
                }
            },
            {
                id: 'kraken',
                exchangeId: 'kraken',
                adapter: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 504},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Remote host closed connection during handshake'},
                    ]
                }
            }
        ];

        /**
         * The Markets being trading on.
         */
        let markets = [
            {
                id: 'bitstamp_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'bitstamp',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'bitstamp_ema'}
            },
            {
                id: 'btce_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'btce',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'btce_macd_rsi'}
            },
            {
                id: 'gdax_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'gdax',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'gdax_short-scalper'}
            },
            {
                id: 'gdax_btc_gbp',
                label: 'BTC/GBP',
                exchangeId: 'gdax',
                enabled: true,
                baseCurrency: 'BTC',
                counterCurrency: 'GBP',
                tradingStrategy: {id: 'gdax_long-scalper'}
            },
            {
                id: 'gemini_eth_btc',
                label: 'ETH/BTC',
                exchangeId: 'gemini',
                enabled: false,
                baseCurrency: 'ETH',
                counterCurrency: 'BTC',
                tradingStrategy: {id: 'gemini_macd'}
            },
            {
                id: 'okcoin_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'okcoin',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'okcoin_ema'}
            },
            {
                id: 'huobi_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'huobi',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'huobi_ema_rsi'}
            },
            {
                id: 'bitfinex_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'bitfinex',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'bitfinex_long-scalper'}
            },
            {
                id: 'kraken_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'kraken',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'kraken_ema_rsi'}
            },
            {
                id: 'itbit_btc_usd',
                label: 'BTC/USD',
                exchangeId: 'itbit',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {id: 'itbit_long-scalper'}
            },
        ];

        /**
         * The Trading Strategies being executed.
         */
        let tradingStrategies = [
            {
                id: 'btce_macd_rsi',
                label: 'MACD RSI Indicator',
                exchangeId: 'btce',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'btce_long-scalper',
                label: 'Long Scalper',
                exchangeId: 'btce',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'gdax_long-scalper',
                label: 'Long Scalper',
                exchangeId: 'gdax',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'gdax_ema',
                label: 'MACD Indicator',
                exchangeId: 'gdax',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'bitstamp_ema',
                label: 'EMA Indicator',
                exchangeId: 'bitstamp',
                description: 'EAM Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'gemini_macd',
                label: 'MACD Indicator',
                exchangeId: 'gemini',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy'
            },
            {
                id: 'gemini_long-scalper',
                label: 'Long Scalper',
                exchangeId: 'gemini',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'okcoin_ema',
                label: 'MACD Indicator',
                exchangeId: 'okcoin',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'huobi_ema_rsi',
                label: 'MACD RSI Indicator',
                exchangeId: 'huobi',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'bitfinex_long-scalper',
                label: 'Long Scalper',
                exchangeId: 'bitfinex',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'kraken_ema_rsi',
                label: 'EMA RSI Indicator',
                exchangeId: 'kraken',
                description: 'EMA Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaRsiStrategy'
            },
            {
                id: 'itbit_long-scalper',
                label: 'Long Scalper',
                exchangeId: 'itbit',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            }
        ];

        /**
         * The Email Alerts config for the bots running on the Exchanges.
         */
        let emailAlerts = [
            {
                id: 'btce_email_alerts',
                exchangeId: 'btce',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'bobfett',
                accountPassword: 'iLoveHoth',
                toAddress: 'jabba@tatooine.space',
                fromAddress: 'boba.fett@hoth.space'
            },
            {
                id: 'bitstamp_email_alerts',
                exchangeId: 'bitstamp',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'darthvader',
                accountPassword: 'TheForceIsStrongWithThisOne',
                toAddress: 'boba.fett@hoth.space',
                fromAddress: 'darth@deathstar.space'
            },
            {
                id: 'gdax_email_alerts',
                exchangeId: 'gdax',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'solo',
                accountPassword: 'NeverTellMeTheOdds!',
                toAddress: 'lando@cloudcity.space',
                fromAddress: 'han.solo@falcon.space'
            },
            {
                id: 'itbit_email_alerts',
                exchangeId: 'itbit',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'gold5',
                accountPassword: 'stayOnTarget',
                toAddress: 'chewy@kashyyyk.space',
                fromAddress: 'gold5@x-wing.space'
            },
            {
                id: 'huobi_email_alerts',
                exchangeId: 'huobi',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'ackbar',
                accountPassword: 'ItsATrap!',
                toAddress: 'leia@alderaan.space',
                fromAddress: 'admiral.ackbar@some-one.space'
            },
            {
                id: 'okcoin_email_alerts',
                exchangeId: 'okcoin',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'yoda',
                accountPassword: 'DoOrDoNotThereIsNoTry',
                toAddress: 'r2d2@naboo.space',
                fromAddress: 'master.yoda@dagobah.space',
            },
            {
                id: 'kraken_email_alerts',
                exchangeId: 'kraken',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'obiwan',
                accountPassword: 'UseTheForceLuke',
                toAddress: 'luke.skywalker@tatooine.space',
                fromAddress: 'Obi.Wan@coruscant.space',
            },
            {
                id: 'bitfinex_email_alerts',
                exchangeId: 'bitfinex',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'chewy',
                accountPassword: 'grrrrrrrrrrrrrr',
                toAddress: 'luke.skywalker@tatooine.space',
                fromAddress: 'chewbacca@kashyyyk.space',
            },
            {
                id: 'gemini_email_alerts',
                exchangeId: 'gemini',
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'c3po',
                accountPassword: 'ohMy!',
                toAddress: 'bb-8@jakku.space',
                fromAddress: 'c-3p0@naboo.space',
            }
        ];

        return {exchanges, exchangeAdapters, markets, tradingStrategies, emailAlerts};
    }
}
