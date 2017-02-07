import "rxjs/add/operator/toPromise";
import {Market} from "./market.model";

/**
 * The Market Data Service provides operations to update Market configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface MarketDataPromiseService {

    getAllMarketsForExchange(exchangeId: string): Promise<Market[]>;
    updateMarket(market: Market): Promise<Market>;
    deleteMarketById(marketId: string): Promise<Market>;
}
