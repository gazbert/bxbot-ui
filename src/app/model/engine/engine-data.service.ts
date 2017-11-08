import 'rxjs/add/operator/toPromise';
import {Engine} from './engine.model';

/**
 * The Engine Data Service provides operations to update Engine configuration.
 * It uses Promises in the operation responses.
 *
 * @author gazbert
 */
export interface EngineDataService {

    getEngineByBotId(botId: string): Promise<Engine>;

    updateEngine(botId: string, engine: Engine): Promise<Engine>;
}
