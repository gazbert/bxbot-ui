import "rxjs/add/operator/toPromise";
import {Market} from "./market.model";

/**
 * The Market Data Service communicates with the trading bots.
 * The service is used to update the bot's Market Adapter configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface MarketDataPromiseService {

    getAllMarketsForExchange(exchangeId: string): Promise<Market[]>;
    updateMarket(market: Market): Promise<Market>;
    deleteMarketById(marketId: string): Promise<Market>;
}
