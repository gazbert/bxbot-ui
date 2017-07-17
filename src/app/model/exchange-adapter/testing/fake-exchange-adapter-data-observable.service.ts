import {Observable} from 'rxjs/Observable';
import {ExchangeAdapter, NetworkConfig} from "../exchange-adapter.model";
import {ExchangeAdapterHttpDataObservableService} from "../exchange-adapter-http-data-observable.service";

/**
 * Fake Bot Adapter data service (Observable flavour) backend for testing.
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

    getExchangeAdapterByExchangeId(id: string): Observable<ExchangeAdapter> {
        let exchangeAdapter = this.exchangeAdapters.find(e => e.id === id);
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

export var SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS: ExchangeAdapter[] = [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.bots.BitstampExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.bots.GdaxExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        )),
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.bots.GeminiExchangeAdapter',
        new NetworkConfig(60,
            [
                {value: 503},
                {value: 504},
                {value: 522},
            ],
            [
                {value: "Connection reset"},
                {value: "Connection refused"},
                {value: "Remote host closed connection during handshake"}
            ]
        ))
];
