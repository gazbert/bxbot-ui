import 'rxjs/add/operator/toPromise';
import {BotConfig} from './bot-config.model';

/**
 * The BotConfig Data Service provides operations to update Bot configuration.
 * It uses Promises in the operation responses.
 *
 * @author gazbert
 */
export interface BotConfigDataService {

    getAllBotConfig(): Promise<BotConfig[]>;
}
