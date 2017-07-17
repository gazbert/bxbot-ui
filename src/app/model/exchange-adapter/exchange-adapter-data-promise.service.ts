import "rxjs/add/operator/toPromise";
import {ExchangeAdapter} from "./exchange-adapter.model";

/**
 * The Bot Adapter Data Service provides operations to update Bot Adapter configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataPromiseService {

    getExchangeAdapters(): Promise<ExchangeAdapter[]>;
    getExchangeAdapterByExchangeId(id: string): Promise<ExchangeAdapter>;
    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter>;
}
