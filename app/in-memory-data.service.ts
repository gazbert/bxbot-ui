import {InMemoryDbService} from "angular2-in-memory-web-api";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {
                id: 'Bitstamp',
                adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [502, 503, 504, 530, 522, 525],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'GDAX',
                adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [502, 503, 504, 522],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Remote host closed connection during handshake",
                    ]
                }
            },
            {
                id: 'Gemini',
                adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [502, 503, 504],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'ItBit',
                adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [502, 504, 530, 522, 525],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'BTC-e',
                adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [503, 504, 530, 522, 525],
                    nonFatalErrorMessages: [
                        "Connection refused",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'OKCoin',
                adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [502, 503, 504, 530, 522],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'Bitfinex',
                adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [502, 530, 522, 525],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Connection refused",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'Huobi',
                adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [504, 530, 522, 525],
                    nonFatalErrorMessages: [
                        "Connection reset",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            },
            {
                id: 'Kraken',
                adapter: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [502, 503, 504, 525],
                    nonFatalErrorMessages: [
                        "Connection refused",
                        "Remote host closed connection during handshake",
                        "Unexpected end of file from server"
                    ]
                }
            }
        ];
        return {exchanges};
    }
}
