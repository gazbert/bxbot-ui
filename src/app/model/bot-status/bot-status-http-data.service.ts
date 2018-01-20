import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {BotStatusDataService} from './bot-status-data.service';
import {AuthenticationService, RestApiUrlService} from '../../shared';
import {BotStatus} from './bot-status.model';
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
 * @author gazbert
 */
@Injectable()
export class BotStatusHttpDataService implements BotStatusDataService {

    private static ENDPOINT_PATH = '/status';

    constructor(private http: HttpClient) {
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
        if (isObject(res)) {
            return res || {};
        } else {
            return {};
        }
    }

    getAllBotStatus(): Observable<BotStatus[]> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildRuntimeEndpointUrl(null, BotStatusHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .map(BotStatusHttpDataService.extractData)
            .catch(BotStatusHttpDataService.handleError);
    }

    getBotStatusById(botId: string): Observable<BotStatus> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildRuntimeEndpointUrl(botId, BotStatusHttpDataService.ENDPOINT_PATH);
        return this.http
            .get(url, {headers: headers})
            .map(BotStatusHttpDataService.extractData)
            .catch(BotStatusHttpDataService.handleError);
    }

    getBotStatusByBotName(name: string): Observable<BotStatus[]> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildRuntimeEndpointUrl(null, BotStatusHttpDataService.ENDPOINT_PATH);
        return this.http
            .get(url + '/?name=' + name, {headers: headers})
            .map(BotStatusHttpDataService.extractData)
            .catch(BotStatusHttpDataService.handleError);
    }

    updateBotStatus(bot: BotStatus): Observable<BotStatus> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildRuntimeEndpointUrl(bot.id, BotStatusHttpDataService.ENDPOINT_PATH);
        const body = JSON.stringify(bot);

        return this.http.put(url, body, headers)
            .map(BotStatusHttpDataService.extractData)
            .catch(BotStatusHttpDataService.handleError);
    }
}
