// re-export for tester convenience
import {Exchange, NetworkConfig} from "../../model";
import {ExchangeHttpDataService} from "../exchange-http-data.service";

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
 * Fake Exchange data service backend for testing.
 *
 * Constructor inherited from ExchangeHttpDataService - calling code should pass null when creating this object.
 *
 * This seems very hacky. Must be better way of using the mock below, but we have to inject concrete
 * service classes into the components...
 */
export class FakeExchangeDataService extends ExchangeHttpDataService {

    exchanges = EXCHANGES.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getExchanges() {
        return this.lastPromise = Promise.resolve<Exchange[]>(this.exchanges);
    }

    getExchange(id: string) {
        let exchange = this.exchanges.find(e => e.id === id);
        return this.lastPromise = Promise.resolve(exchange);
    }

    update(exchange: Exchange): Promise<Exchange> {
        return this.lastPromise = this.getExchange(exchange.id).then(e => {
            return e ?
                Object.assign(e, exchange) :
                Promise.reject(`Exchange ${exchange.id} not found`) as any as Promise<Exchange>;
        });
    }
}