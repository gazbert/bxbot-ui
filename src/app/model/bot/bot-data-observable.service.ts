import 'rxjs/add/operator/toPromise';
import {Observable} from 'rxjs/Observable';
import {Bot} from './bot.model';

/**
 * The Bot Data Service provides operations to fetch Bot metadata and status details.
 * It demonstrates use of Observables in the operation responses.
 *
 * @author gazbert
 */
export interface BotDataObservableService {

    getBots(): Observable<Bot[]>;

    getBot(id: string): Observable<Bot>;

    getBotByName(name: string): Observable<Bot[]>;

    update(bot: Bot): Observable<Bot>;
}
