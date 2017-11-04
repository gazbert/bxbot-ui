import {Injectable} from '@angular/core';
import {Headers, Http, RequestOptions, Response} from '@angular/http';
import {AppComponent} from '../../app.component';
import {BotDataObservableService} from './bot-data-observable.service';
import {AuthenticationService} from '../../shared';
import {BotStatus} from './bot.model';
import {Observable} from 'rxjs/Observable';
import {isObject} from 'rxjs/util/isObject';
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the BotStatus Data Service.
 *
 * It demonstrates use of Observables in call responses.
 *
 * An Observable is a stream of events that can be processed with array-like operators.
 * Angular uses the RxJS library to provide basic support for Observables.
 *
 * Observables are useful if you start a request, cancel it, and then make a different request before the server has
 * responded to the first request. This request-cancel-new-request sequence is difficult to implement with Promises.
 *
 * @author gazbert
 */
@Injectable()
export class BotHttpDataObservableService implements BotDataObservableService {

    private botUrl = AppComponent.REST_API_BASE_URL + '/bots';

    constructor(private http: Http) {
    }

    private static handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // Redirect to friendly error page?
        const errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private static extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        const body = res.json();

        if (isObject(body)) { // vs // if (body !== undefined && body !== null) {
            return body.data || {};
        } else {
            return {};
        }
    }

    getBots(): Observable<BotStatus[]> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        return this.http.get(this.botUrl, {headers: headers})
            .map(BotHttpDataObservableService.extractData)
            .catch(BotHttpDataObservableService.handleError);
    }

    getBot(id: string): Observable<BotStatus> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        return this.http
            .get(this.botUrl + '/' + id, {headers: headers})
            .map((r: Response) => r.json().data as BotStatus)
            // .map(this.extractData)
            .catch(BotHttpDataObservableService.handleError);
    }

    getBotByName(name: string): Observable<BotStatus[]> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        return this.http
            .get(this.botUrl + '/?displayName=' + name, {headers: headers})
            .map(BotHttpDataObservableService.extractData)
            // .map((r: Response) => r.json().data as BotStatus[])
            .catch(BotHttpDataObservableService.handleError);
    }

    update(bot: BotStatus): Observable<BotStatus> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.botUrl + '/' + bot.id;
        const body = JSON.stringify(bot);
        const options = new RequestOptions({headers: headers});

        return this.http.put(url, body, options)
            .map(BotHttpDataObservableService.extractData)
            .catch(BotHttpDataObservableService.handleError);
    }
}
