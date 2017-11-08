import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {BotStatus} from './bot-status.model';

/**
 * The BotStatus Data Service provides operations to fetch BotStatus details.
 * It uses Observables in the operation responses.
 *
 * @author gazbert
 */
export interface BotStatusDataService {

    getAllBotStatus(): Observable<BotStatus[]>;

    getBotStatusById(id: string): Observable<BotStatus>;

    getBotStatusByBotName(name: string): Observable<BotStatus[]>;

    updateBotStatus(bot: BotStatus): Observable<BotStatus>;
}
