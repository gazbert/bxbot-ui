import "rxjs/add/operator/toPromise";
import {ExchangeAdapter} from "./exchange-adapter.model";

/**
 * The Exchange Adapter Data Service provides operations to update Exchange Adapter configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataPromiseService {

    getExchangeAdapters(): Promise<ExchangeAdapter[]>;
    getExchangeAdapterByBotId(id: number): Promise<ExchangeAdapter>;
    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter>;
}
