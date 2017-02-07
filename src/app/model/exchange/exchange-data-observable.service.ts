import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs";
import {Exchange} from "./exchange.model";

/**
 * The Exchange Data Service provides operations to update Exchange configuration.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeDataObservableService {

    getExchanges(): Observable<Exchange[]>;
    getExchange(id: string): Observable<Exchange>;
    update(exchange: Exchange): Observable<Exchange>;
}
