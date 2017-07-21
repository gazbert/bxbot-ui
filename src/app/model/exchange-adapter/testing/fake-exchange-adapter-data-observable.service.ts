import {Observable} from 'rxjs/Observable';
import {ExchangeAdapter, NetworkConfig} from "../exchange-adapter.model";
import {ExchangeAdapterHttpDataObservableService} from "../exchange-adapter-http-data-observable.service";

/**
 * Fake Exchange Adapter data service (Observable flavour) backend for testing.
 *
 * @author gazbert
 */
export class FakeExchangeAdapterDataObservableService extends ExchangeAdapterHttpDataObservableService {

    exchangeAdapters = SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS.map(e => e.clone());

    getExchangeAdapters(): Observable<ExchangeAdapter[]> {
        return Observable.create(observer => {
            observer.next(this.exchangeAdapters);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    getExchangeAdapterByBotId(id: number): Observable<ExchangeAdapter> {
        let exchangeAdapter = this.exchangeAdapters.find(e => e.botId === id);
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
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter', 1,
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                "Connection reset",
                "Connection refused",
                "Remote host closed connection during handshake"
            ]
        )),
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter', 2,
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                "Connection reset",
                "Connection refused",
                "Remote host closed connection during handshake"
            ]
        )),
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter', 3,
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                "Connection reset",
                "Connection refused",
                "Remote host closed connection during handshake"
            ]
        ))
];
