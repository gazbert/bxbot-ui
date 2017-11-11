import {Observable} from 'rxjs/Observable';
import {Exchange, NetworkConfig, OptionalConfig} from '../exchange.model';
import {ExchangeDataObservableService} from '../exchange-data-observable.service';

/**
 * Fake Exchange Data Service backend for testing.
 *
 * @author gazbert
 */
export class FakeExchangeDataObservableService implements ExchangeDataObservableService {

    exchanges = SOME_FAKE_EXCHANGES.map(e => e.clone());

    getExchangeByBotId(id: string): Observable<Exchange> {
        const exchange = this.exchanges.find(e => e.id === id);
        return Observable.create(observer => {
            observer.next(exchange);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    updateExchange(exchange: Exchange): Observable<Exchange> {
        return Observable.create(observer => {
            observer.next(exchange);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }
}

export const SOME_FAKE_EXCHANGES: Exchange[] = [
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
        ))
];
