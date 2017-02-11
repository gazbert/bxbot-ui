import {ExchangeHttpDataObservableService} from "../exchange-http-data-observable.service";
import {Exchange} from "../exchange.model";
import {Observable} from 'rxjs/Observable';

/**
 * Fake Exchange data service (Observable flavour) backend for testing.
 *
 * Constructor is inherited from FakeExchangeDataObservableService - calling code should pass null when creating this object.
 * This seems very hacky.
 * Must be better way of doing this, but we have to inject concrete service classes into the components...
 *
 * @author gazbert
 */
export class FakeExchangeDataObservableService extends ExchangeHttpDataObservableService {

    exchanges = SOME_MORE_EXCHANGES.map(e => e.clone());

    getExchanges(): Observable<Exchange[]> {
        return Observable.create(observer => {
                observer.next(this.exchanges);
                // call complete if you want to close this stream (like a promise)
                observer.complete();
            });
    }

    getExchange(id: string): Observable<Exchange> {
        let exchange = this.exchanges.find(e => e.id === id);
        return Observable.create(observer => {
            observer.next(exchange);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    getExchangeByName(name: string): Observable<Exchange[]> {
        let exchange = this.exchanges.find(e => e.name === name);
        return Observable.create(observer => {
            observer.next(exchange);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    update(exchange: Exchange): Observable<Exchange> {
        return Observable.create(observer => {
            observer.next(exchange);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }
}

export var SOME_MORE_EXCHANGES: Exchange[] = [
    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Running'),
    new Exchange('gemini', 'Gemini', 'Stopped')
];