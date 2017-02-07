import "rxjs/add/operator/toPromise";
import {TradingStrategy} from "./trading-strategy.model";

/**
 * The Trading Strategy Data Service provides operations to update Trading Strategy configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface TradingStrategyDataPromiseService {

    getAllTradingStrategiesForExchange(exchangeId: string): Promise<TradingStrategy[]>;
    updateTradingStrategy(tradingStrategy: TradingStrategy): Promise<TradingStrategy>;
    deleteTradingStrategyById(tradingStrategyId: string): Promise<TradingStrategy>;
}
