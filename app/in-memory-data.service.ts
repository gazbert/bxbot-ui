import {InMemoryDbService} from "angular2-in-memory-web-api";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {
                id: 'Bitstamp',
                adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 60,
                    nonFatalErrorHttpStatusCodes: [
                        {value: 502},
                        {value: 503},
                        {value: 504},
                        {value: 530},
                        {value: 522},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'GDAX',
                adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 120,
                    nonFatalErrorHttpStatusCodes: [
                        {id: 1, value: 502},
                        {id: 2, value: 503},
                        {id: 3, value: 503},
                        {id: 4, value: 525},
                        {id: 5, value: 530},
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'Gemini',
                adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 90,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'ItBit',
                adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 30,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'BTC-e',
                adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 45,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'OKCoin',
                adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 50,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'Bitfinex',
                adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 20,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            },
            {
                id: 'Huobi',
                adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter',
                networkConfig: {
                    connectionTimeout: 10,
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
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
                    nonFatalErrorHttpStatusCodes: [
                        {
                            code: {id: 1, value: 502}
                        },
                        {
                            code: {id: 2, value: 503}
                        },
                        {
                            code: {id: 3, value: 503}
                        },
                        {
                            code: {id: 4, value: 525}
                        },
                        {
                            code: {id: 5, value: 530}
                        }
                    ],
                    nonFatalErrorMessages: [
                        {value: "Connection reset"},
                        {value: "Connection refused"},
                        {value: "Remote host closed connection during handshake"},
                        {value: "Unexpected end of file from server"}
                    ]
                }
            }
        ];
        return {exchanges};
    }
}
