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
                name: 'Bitstamp',
                status: 'Running'
            },
            {
                id: 'gdax',
                name: 'GDAX',
                status: 'Running'
            },
            {
                id: 'gemini',
                name: 'Gemini',
                status: 'Stopped'
            },
            {
                id: 'itbit',
                name: 'ItBit',
                status: 'Running'
            },
            {
                id: 'btce',
                name: 'BTC-e',
                status: 'Running'
            },
            {
                id: 'okcoin',
                name: 'OKCoin',
                status: 'Running'
            },
            {
                id: 'bitfinex',
                name: 'Bitfinex',
                status: 'Stopped'
            },
            {
                id: 'huobi',
                name: 'Huobi',
                status: 'Stopped'
            },
            {
                id: 'kraken',
                name: 'Kraken',
                status: 'Running'
            }
        ];

        /**
         * The Exchange Adapters for integrating with the Exchanges.
         */
        let exchangeAdapters = [
            {
                id: 'bitstamp',
                name: 'Bitstamp REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
                name: 'GDAX REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 503},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: ''}
                    ]
                }
            },
            {
                id: 'gemini',
                name: 'Gemini REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
                name: 'ItBit REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
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
                name: 'BTC-e API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
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
                name: 'OKCoin REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
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
                name: 'Bitfinex REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
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
                name: 'Huobi REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
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
                name: 'Kraken REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
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
                exchangeId: 'bitstamp',
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
                id: 'btce_btc_usd',
                exchangeId: 'btce',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'btce_macd_rsi',
                    exchangeId: 'btce',
                    name: 'MACD RSI Indicator',
                    description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
                }
            },
            {
                id: 'btce_ltc_usd',
                exchangeId: 'btce',
                name: 'LTC/USD',
                enabled: true,
                baseCurrency: 'LTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'btce_long-scalper',
                    exchangeId: 'btce',
                    name: 'Long Scalper',
                    description: 'Scalping strategy that buys low and sells high.',
                    className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
                }
            },
            {
                id: 'gdax_btc_usd',
                exchangeId: 'gdax',
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
                exchangeId: 'gdax',
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
                exchangeId: 'gemini',
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
                id: 'okcoin_btc_usd',
                exchangeId: 'okcoin',
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
                id: 'huobi_btc_usd',
                exchangeId: 'huobi',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'huobi_ema_rsi',
                    exchangeId: 'huobi',
                    name: 'MACD RSI Indicator',
                    description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
                }
            },
            {
                id: 'bitfinex_btc_usd',
                exchangeId: 'bitfinex',
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
                id: 'kraken_btc_usd',
                exchangeId: 'kraken',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'kraken_ema_rsi',
                    exchangeId: 'kraken',
                    name: 'EMA RSI Indicator',
                    description: 'EMA Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaRsiStrategy'
                }
            },
            {
                id: 'itbit_btc_usd',
                exchangeId: 'itbit',
                name: 'BTC/USD',
                enabled: false,
                baseCurrency: 'BTC',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'itbit_ema_rsi',
                    exchangeId: 'itbit',
                    name: 'MACD RSI Indicator',
                    description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
                }
            },
        ];

        /**
         * The Trading Strategies being executed.
         */
        let tradingStrategies = [
            {
                id: 'btce_macd_rsi',
                exchangeId: 'btce',
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'btce_long-scalper',
                exchangeId: 'btce',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'btce_short-scalper',
                exchangeId: 'btce',
                name: 'Short Scalper',
                description: 'Scalping strategy that sells and buys back more units at lower price.',
                className: 'com.gazbert.bxbot.strategies.ShortScalperStrategy'
            },
            {
                id: 'gdax_long-scalper',
                exchangeId: 'gdax',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'gdax_ema',
                exchangeId: 'gdax',
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'bitstamp_ema',
                exchangeId: 'bitstamp',
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'gemini_macd',
                exchangeId: 'gemini',
                name: 'MACD Indicator',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy'
            },
            {
                id: 'gemini_long-scalper',
                exchangeId: 'gemini',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'okcoin_ema',
                exchangeId: 'okcoin',
                name: 'MACD Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'huobi_ema_rsi',
                exchangeId: 'huobi',
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'bitfinex_long-scalper',
                exchangeId: 'bitfinex',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'kraken_ema_rsi',
                exchangeId: 'kraken',
                name: 'EMA RSI Indicator',
                description: 'EMA Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaRsiStrategy'
            },
            {
                id: 'itbit_long-scalper',
                exchangeId: 'itbit',
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'itbit_ema_rsi',
                exchangeId: 'itbit',
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
        ];

        /**
         * The Email Alerts config for the bots to send alert messages.
         */
        let emailAlerts = [
            {
                id: 'btce_email_alerts',
                exchangeId: 'btce',
                enabled: false,
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
                enabled: false,
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
                enabled: false,
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
