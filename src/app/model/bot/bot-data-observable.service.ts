import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {BotStatus} from './bot.model';

/**
 * The BotStatus Data Service provides operations to fetch BotStatus details.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface BotDataObservableService {

    getBots(): Observable<BotStatus[]>;

    getBot(id: string): Observable<BotStatus>;

    getBotByName(name: string): Observable<BotStatus[]>;

    update(bot: BotStatus): Observable<BotStatus>;
}
