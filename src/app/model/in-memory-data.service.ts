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
        let bots = [
            {
                id: 1,
                name: 'Bitstamp',
                status: 'Running'
            },
            {
                id: 2,
                name: 'GDAX',
                status: 'Running'
            },
            {
                id: 3,
                name: 'Gemini',
                status: 'Stopped'
            },
            {
                id: 4,
                name: 'ItBit',
                status: 'Running'
            },
            {
                id: 5,
                name: 'BTC-e',
                status: 'Running'
            },
            {
                id: 6,
                name: 'OKCoin',
                status: 'Running'
            },
            {
                id: 7,
                name: 'Bitfinex',
                status: 'Stopped'
            },
            {
                id: 8,
                name: 'Huobi',
                status: 'Stopped'
            },
            {
                id: 9,
                name: 'Kraken',
                status: 'Running'
            }
        ];

        /**
         * The Exchange Adapters.
         * There is a 1-1 relationship with the bot - backend server will always set 'id' to the same as the Bot 'id'.
         */
        let exchange_adapters = [
            {
                id: 1,
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
                }
            },
            {
                id: 2,
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
                }
            },
            {
                id: 3,
                name: 'Gemini REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        504
                    ],
                    nonFatalErrorMessages: [
                        {value: 'Connection reset'},
                        {value: 'Remote host closed connection during handshake'}
                    ]
                }
            },
            {
                id: 4,
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
                }
            },
            {
                id: 5,
                name: 'BTC-e API Adapter',
                className: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
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
                }
            },
            {
                id: 6,
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
                }
            },
            {
                id: 7,
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
                }
            },
            {
                id: 8,
                name: 'Huobi REST API Adapter',
                className: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [
                        503,
                        504
                    ],
                    nonFatalErrorMessages: [
                        'Connection reset',
                        'Connection refused'
                    ]
                }
            },
            {
                id: 9,
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
                }
            }
        ];

        /**
         * The Markets being trading on.
         * The 'id' field is required because we cannot rely on the marketId being unique across different Exchanges -
         * it is often the same. e.g. btcusd
         */
        let markets = [
            {
                id: 'bitstamp_btc_usd',
                botId: 1,
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
                botId: 2,
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
                botId: 2,
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
                botId: 3,
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
                botId:4,
                marketId: 'XBTUSD',
                name: 'XBT/USD',
                enabled: false,
                baseCurrency: 'XBT',
                counterCurrency: 'USD',
                tradingStrategy: {
                    id: 'itbit_ema_rsi',
                    exchangeId: 'itbit',
                    name: 'MACD RSI Indicator',
                    description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
                }
            },
            {
                id: 'btce_btc_usd',
                botId: 5,
                marketId: 'btc_usd',
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
                botId: 5,
                marketId: 'ltc_usd',
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
                id: 'okcoin_btc_usd',
                botId: 6,
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
                botId: 7,
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
                id: 'huobi_btc_usd',
                botId: 8,
                marketId: 'BTC-USD',
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
                id: 'kraken_xbt_usd',
                botId: 9,
                marketId: 'XBTUSD',
                name: 'XBT/USD',
                enabled: false,
                baseCurrency: 'XXBT',
                counterCurrency: 'ZUSD',
                tradingStrategy: {
                    id: 'kraken_ema_rsi',
                    exchangeId: 'kraken',
                    name: 'EMA RSI Indicator',
                    description: 'EMA Indicator and RSI algo for deciding when to enter and exit trades.',
                    className: 'com.gazbert.bxbot.strategies.EmaRsiStrategy'
                }
            }
        ];

        /**
         * The Trading Strategies being executed.
         */
        let trading_strategies = [
            {
                id: 'btce_macd_rsi',
                botId: 5,
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'btce_long-scalper',
                botId: 5,
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'btce_short-scalper',
                botId: 5,
                name: 'Short Scalper',
                description: 'Scalping strategy that sells and buys back more units at lower price.',
                className: 'com.gazbert.bxbot.strategies.ShortScalperStrategy'
            },
            {
                id: 'gdax_long-scalper',
                botId: 2,
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'gdax_ema',
                botId: 2,
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'bitstamp_ema',
                botId: 1,
                name: 'EMA Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'gemini_macd',
                botId: 3,
                name: 'MACD Indicator',
                description: 'MACD Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdStrategy'
            },
            {
                id: 'gemini_long-scalper',
                botId: 3,
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'okcoin_ema',
                botId: 6,
                name: 'MACD Indicator',
                description: 'EMA Indicator algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaStrategy'
            },
            {
                id: 'huobi_ema_rsi',
                botId: 8,
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
            {
                id: 'bitfinex_long-scalper',
                botId: 7,
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'kraken_ema_rsi',
                botId: 9,
                name: 'EMA RSI Indicator',
                description: 'EMA Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.EmaRsiStrategy'
            },
            {
                id: 'itbit_long-scalper',
                botId: 4,
                name: 'Long Scalper',
                description: 'Scalping strategy that buys low and sells high.',
                className: 'com.gazbert.bxbot.strategies.LongScalperStrategy'
            },
            {
                id: 'itbit_ema_rsi',
                botId: 4,
                name: 'MACD RSI Indicator',
                description: 'MACD Indicator and RSI algo for deciding when to enter and exit trades.',
                className: 'com.gazbert.bxbot.strategies.MacdRsiStrategy'
            },
        ];

        /**
         * The Email Alerts config for bots to send alert messages.
         * There is a 1-1 relationship with the bot - backend server will always set 'id' to the same as the Bot 'id'.
         */
        let email_alerts = [
            {
                id: 1,
                enabled: false,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'bobfett',
                accountPassword: 'iLoveHoth',
                toAddress: 'jabba@tatooine.space',
                fromAddress: 'boba.fett@hoth.space'
            },
            {
                id: 2,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'solo',
                accountPassword: 'NeverTellMeTheOdds_',
                toAddress: 'lando@cloudcity.space',
                fromAddress: 'han.solo@falcon.space'
            },
            {
                id: 3,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'c3po',
                accountPassword: 'ohMy',
                toAddress: 'bb-8@jakku.space',
                fromAddress: 'c-3p0@naboo.space',
            },
            {
                id: 4,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'gold5',
                accountPassword: 'stayOnTarget',
                toAddress: 'chewy@kashyyyk.space',
                fromAddress: 'gold5@x-wing.space'
            },
            {
                id: 5,
                enabled: false,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'ackbar-1',
                accountPassword: 'ItsATrap#',
                toAddress: 'leia@alderaan.space',
                fromAddress: 'admiral.ackbar@some-one.space'
            },
            {
                id: 6,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'yoda',
                accountPassword: 'DoOrDoNotThereIsNoTry£',
                toAddress: 'r2d2@naboo.space',
                fromAddress: 'master.yoda@dagobah.space',
            },
            {
                id: 7,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'obiwan',
                accountPassword: '@UseTheForceLuke',
                toAddress: 'luke.skywalker@tatooine.space',
                fromAddress: 'Obi.Wan@coruscant.space',
            },
            {
                id: 8,
                enabled: false,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'chewy',
                accountPassword: 'grrrrrrrrrrrrrr-',
                toAddress: 'luke.skywalker@tatooine.space',
                fromAddress: 'chewbacca@kashyyyk.space',
            },
            {
                id: 9,
                enabled: true,
                smtpHost: 'smtp.gmail.com',
                smtpPort: 587,
                accountUsername: 'darthvader',
                accountPassword: 'TheForceIsStrongWithThisOne',
                toAddress: 'boba.fett@hoth.space',
                fromAddress: 'darth@deathstar.space'
            }
        ];

        return {bots, exchange_adapters, markets, trading_strategies, email_alerts};
    }
}
