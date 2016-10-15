// re-export for tester convenience
import {ExchangeAdapterDataService} from "../exchange-adapter-data.service";
import {Exchange, NetworkConfig} from "../../model";

export var EXCHANGES: Exchange[] = [

    new Exchange('Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
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
    new Exchange('GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
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
    new Exchange('Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
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
];

/**
 * Fake Exchange Adapter data service backend for testing.
 *
 * Weird! We implement a class ? No interface keyword in lang for ExchangeAdapterDataService type???
 */
export class FakeExchangeAdapterDataService implements ExchangeAdapterDataService {

    exchanges = EXCHANGES.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getExchanges() {
        return this.lastPromise = Promise.resolve<Exchange[]>(this.exchanges);
    }

    getExchange(id: string) {
        let exchange = this.exchanges.find(e => e.id === id);
        return this.lastPromise = Promise.resolve(exchange);
    }

    saveExchange(exchange: Exchange): Promise<Exchange> {
        return this.lastPromise = this.getExchange(exchange.id).then(e => {
            return e ?
                Object.assign(e, exchange) :
                Promise.reject(`Exchange ${exchange.id} not found`) as any as Promise<Exchange>;
        });
    }
}