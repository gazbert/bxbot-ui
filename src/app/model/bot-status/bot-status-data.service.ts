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

    getBots(): Observable<BotStatus[]>;

    getBot(id: string): Observable<BotStatus>;

    getBotByName(name: string): Observable<BotStatus[]>;

    update(bot: BotStatus): Observable<BotStatus>;
}
