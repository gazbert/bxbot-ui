import {ExchangeHttpDataPromiseService} from "../exchange-http-data-promise.service";
import {Exchange} from "../exchange.model";

/**
 * Fake Exchange data service (Promise flavour) backend for testing.
 *
 * Constructor is inherited from ExchangeHttpDataPromiseService - calling code should pass null when creating this object.
 * This seems very hacky.
 * Must be better way of doing this, but we have to inject concrete service classes into the components...
 *
 * @author gazbert
 */
export class FakeExchangeDataPromiseService extends ExchangeHttpDataPromiseService {

    exchanges = SOME_EXCHANGES.map(e => e.clone());
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

// re-export for tester convenience
export var SOME_EXCHANGES: Exchange[] = [
    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Running'),
    new Exchange('gemini', 'Gemini', 'Stopped')
];