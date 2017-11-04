import {BotHttpDataObservableService} from '../bot-status-http-data-observable.service';
import {BotStatus} from '../bot-status.model';
import {Observable} from 'rxjs/Observable';

/**
 * Fake BotStatus data service (Observable flavour) backend for testing.
 *
 * Constructor is inherited from BotHttpDataObservableService - calling code should pass null when creating this object.
 *
 * This seems very hacky using extending BotHttpDataObservableService instead of implementing BotDataObservableService interface?
 *
 * Must be better way of doing this, but we have to inject concrete service classes into the DashboardComponent constructor.
 *
 * @author gazbert
 */
export class FakeBotDataObservableService extends BotHttpDataObservableService {

    bots = SOME_FAKE_OBSERVABLE_BOTS.map(e => e.clone());

    getBots(): Observable<BotStatus[]> {
        return Observable.create(observer => {
            observer.next(this.bots);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    getBot(id: string): Observable<BotStatus> {
        const bot = this.bots.find(e => e.id === id);
        return Observable.create(observer => {
            observer.next(bot);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }

    getBotByName(name: string): Observable<BotStatus[]> {
        const bot = this.bots.find(e => e.displayName === name);
        return Observable.create(observer => {
            observer.next(bot);
            // call complete if you want to close this stream (like a promise)
            observer.complete();
        });
    }
}

export const SOME_FAKE_OBSERVABLE_BOTS: BotStatus[] = [
    new BotStatus('bitstamp-1', 'Bitstamp', 'Running'),
    new BotStatus('gdax-2', 'GDAX', 'Running'),
    new BotStatus('gemini-3', 'Gemini', 'Stopped')
];
