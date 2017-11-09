import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {ExchangeAdapter} from './exchange.model';

/**
 * The Exchange Adapter Data Service provides operations to update Exchange Adapter configuration.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataObservableService {

    getExchangeAdapterByBotId(botId: string): Observable<ExchangeAdapter>;

    update(exchangeAdapter: ExchangeAdapter): Observable<ExchangeAdapter>;
}
