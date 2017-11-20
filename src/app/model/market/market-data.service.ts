import 'rxjs/add/operator/toPromise';
import {Market} from './market.model';

/**
 * The Market Data Service provides operations to update Market configuration.
 * It uses Promises in the operation responses.
 *
 * @author gazbert
 */
export interface MarketDataService {

    getAllMarketsForBotId(botId: string): Promise<Market[]>;

    updateMarket(botId: string, market: Market): Promise<Market>;

    deleteMarketById(botId: string, marketId: string): Promise<boolean>;
}
