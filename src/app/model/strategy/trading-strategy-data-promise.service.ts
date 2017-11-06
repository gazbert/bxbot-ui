import 'rxjs/add/operator/toPromise';
import {Strategy} from './trading-strategy.model';

/**
 * The Trading Strategy Data Service provides operations to update Trading Strategy configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface TradingStrategyDataPromiseService {

    getAllTradingStrategiesForBotId(botId: string): Promise<Strategy[]>;

    updateTradingStrategy(tradingStrategy: Strategy): Promise<Strategy>;

    deleteTradingStrategyById(tradingStrategyId: string): Promise<boolean>;
}
