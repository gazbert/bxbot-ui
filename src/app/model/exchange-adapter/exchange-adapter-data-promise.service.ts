import "rxjs/add/operator/toPromise";
import {ExchangeAdapter} from "./exchange-adapter.model";

/**
 * The Exchange Adapter Data Service communicates with the trading bots.
 * The service is used to update the bot's Exchange Adapter configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface ExchangeAdapterDataPromiseService {

    getExchangeAdapters(): Promise<ExchangeAdapter[]>;
    getExchangeAdapterByExchangeId(id: string): Promise<ExchangeAdapter>;
    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter>;
}
