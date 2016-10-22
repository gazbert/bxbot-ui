import "rxjs/add/operator/toPromise";
import {Exchange} from "../model";
import {Observable} from "rxjs";

/**
 * The Exchange Data Service communicates with the trading bots.
 *
 * The service is used to update the bot's Exchange configuration.
 *
 * It uses Observables in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeDataObservableService {

    getExchanges(): Observable<Exchange[]>;
    getExchange(id: string): Observable<Exchange>;
    update(exchange: Exchange): Observable<Exchange>;
}
