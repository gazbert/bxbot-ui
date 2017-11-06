import 'rxjs/add/operator/toPromise';
import {Strategy} from './trading-strategy.model';

/**
 * The Strategy Data Service provides operations to update Strategy configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface StrategyDataPromiseService {

    getAllStrategiesForBotId(botId: string): Promise<Strategy[]>;

    updateStrategy(strategy: Strategy): Promise<Strategy>;

    deleteStrategyById(strategy: string): Promise<boolean>;
}
