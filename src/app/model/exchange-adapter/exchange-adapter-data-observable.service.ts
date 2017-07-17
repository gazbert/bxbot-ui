import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs";
import {ExchangeAdapter} from "./exchange-adapter.model";

/**
 * The Bot Adapter Data Service provides operations to update Bot Adapter configuration.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataObservableService {

    getExchangeAdapters(): Observable<ExchangeAdapter[]>;
    getExchangeAdapterByExchangeId(id: string): Observable<ExchangeAdapter>;
    update(exchangeAdapter: ExchangeAdapter): Observable<ExchangeAdapter>;
}

