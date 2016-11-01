import "rxjs/add/operator/toPromise";
import {Observable} from "rxjs";
import {ExchangeAdapter} from "./exchange-adapter.model";

/**
 * The Exchange Adapter Data Service communicates with the trading bots.
 * The service is used to update the bot's Exchange Adapter configuration.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataObservableService {

    getExchangeAdapters(): Observable<ExchangeAdapter[]>;
    getExchangeAdapterByExchangeId(id: string): Observable<ExchangeAdapter>;
    update(exchangeAdapter: ExchangeAdapter): Observable<ExchangeAdapter>;
}

