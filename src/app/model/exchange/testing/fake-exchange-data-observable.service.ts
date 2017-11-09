import {Observable} from 'rxjs/Observable';
import {ExchangeAdapter, NetworkConfig, OptionalConfig} from '../exchange.model';
import {ExchangeAdapterDataObservableService} from '../exchange-data-observable.service';

/**
 * Fake Exchange Adapter data service (Observable flavour) backend for testing.
 *
 * @author gazbert
 */
export class FakeExchangeAdapterDataObservableService implements ExchangeAdapterDataObservableService {

    exchangeAdapters = SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS.map(e => e.clone());

    getExchangeAdapterByBotId(id: string): Observable<ExchangeAdapter> {
        const exchangeAdapter = this.exchangeAdapters.find(e => e.id === id);
        return Observable.create(observer => {
            observer.next(exchangeAdapter);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    update(exchangeAdapter: ExchangeAdapter): Observable<ExchangeAdapter> {
        return Observable.create(observer => {
            observer.next(exchangeAdapter);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }
}

export const SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS: ExchangeAdapter[] = [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
