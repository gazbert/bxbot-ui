import 'rxjs/add/operator/toPromise';
import {Strategy} from './strategy.model';

/**
 * The Strategy Data Service provides operations to update Strategy configuration.
 * It uses Promises in the operation responses.
 *
 * @author gazbert
 */
export interface StrategyDataService {

    /**
     * Returns all the Strategies for a given bot id.
     *
     * @param {string} botId the id of the bot to fetch the Strategies for.
     * @returns {Promise<Strategy[]>} a Promise containing an array of Strategy objects.
     */
    getAllStrategiesForBotId(botId: string): Promise<Strategy[]>;

    updateStrategy(botId: string, strategy: Strategy): Promise<Strategy>;

    deleteStrategyById(botId: string, strategy: string): Promise<boolean>;
}
