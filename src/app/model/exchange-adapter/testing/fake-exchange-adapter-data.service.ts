import {ExchangeAdapter, NetworkConfig} from "../exchange-adapter.model";
import {ExchangeAdapterHttpDataPromiseService} from "../exchange-adapter-http-data-promise.service";

/**
 * Fake Exchange Adapter data service (Promise flavour) backend for testing.
 *
 * @author gazbert
 */
export class FakeExchangeAdapterDataPromiseService extends ExchangeAdapterHttpDataPromiseService {

    exchangeAdapters = SOME_EXCHANGE_ADAPTERS.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getExchangeAdapters() {
        return this.lastPromise = Promise.resolve<ExchangeAdapter[]>(this.exchangeAdapters);
    }

    getExchangeAdapterByExchangeId(id: string) {
        let exchangeAdapter = this.exchangeAdapters.find(e => e.id === id);
        return this.lastPromise = Promise.resolve(exchangeAdapter);
    }

    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {
        return this.lastPromise = this.getExchangeAdapterByExchangeId(exchangeAdapter.id).then(e => {
            return e ?
                Object.assign(e, exchangeAdapter) :
                Promise.reject(`Exchange Adapter ${exchangeAdapter.id} not found`) as any as Promise<ExchangeAdapter>;
        });
    }
}

export var SOME_EXCHANGE_ADAPTERS: ExchangeAdapter[] = [
    new ExchangeAdapter('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
    new ExchangeAdapter('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
    new ExchangeAdapter('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
