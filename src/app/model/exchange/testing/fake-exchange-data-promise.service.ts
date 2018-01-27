import {Exchange, NetworkConfig, OptionalConfig} from '../exchange.model';
import {ExchangeDataPromiseService} from '../promise';

/**
 * Fake Exchange data service (Promise flavour) backend for testing.
 *
 * @author gazbert
 */
export class FakeExchangeDataPromiseService implements ExchangeDataPromiseService {

    exchanges = SOME_FAKE_PROMISE_EXCHANGES.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getExchangeByBotId(id: string) {
        const exchange = this.exchanges.find(e => e.id === id);
        return this.lastPromise = Promise.resolve(exchange);
    }

    updateExchange(botId: string, exchange: Exchange): Promise<Exchange> {
        return this.lastPromise = this.getExchangeByBotId(exchange.id).then(e => {
            return e ?
                Object.assign(e, exchange) :
                Promise.reject(`Exchange ${exchange.id} not found`) as any as Promise<Exchange>;
        });
    }
}

export const SOME_FAKE_PROMISE_EXCHANGES: Exchange[] = [
    new Exchange('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
    new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
    new Exchange('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
];
