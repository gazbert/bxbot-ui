import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Strategy} from './strategy.model';
import {StrategyDataService} from './strategy-data.service';
import {AuthenticationService, RestApiUrlService} from '../../shared';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Strategy Data Service.
 *
 * It demonstrates use of Promises in call responses.
 *
 * We chain the toPromise operator to the Observable result of http.get. It converts the Observable into a Promise
 * which is passed back to the caller.
 *
 * Converting to a promise is a good choice when asking http.get to fetch a single chunk of data - when we receive the
 * data, we're done. A single result in the form of a promise is easy for the calling component to understand/consume.
 *
 * @author gazbert
 */
@Injectable()
export class StrategyHttpDataService implements StrategyDataService {

    private static ENDPOINT_PATH = '/strategies';

    constructor(private http: HttpClient) {
    }

    getAllStrategiesForBotId(botId: string): Promise<Strategy[]> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, StrategyHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response as Strategy[])
            .catch(this.handleError);
    }

    updateStrategy(botId: string, strategy: Strategy): Promise<Strategy> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, strategy.id, StrategyHttpDataService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(strategy), {headers: headers})
            .toPromise()
            .then(response => response as Strategy)
            .catch(this.handleError);
    }

    deleteStrategyById(botId: string, strategyId: string): Promise<boolean> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, strategyId, StrategyHttpDataService.ENDPOINT_PATH);
        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .then(response => response.status === 200)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
