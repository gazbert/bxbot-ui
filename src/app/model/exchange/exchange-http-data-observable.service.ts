import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Exchange} from './exchange.model';
import {ExchangeDataObservableService} from './exchange-data-observable.service';
import {AuthenticationService, RestApiUrlService} from '../../shared';
import {Observable} from 'rxjs/Observable';
import {isObject} from 'rxjs/util/isObject';
import {isArray} from 'util';

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Data Service.
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
export class ExchangeHttpDataObservableService implements ExchangeDataObservableService {

    private static ENDPOINT_PATH = '/exchange';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
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
            if (isArray(res)) {
                return res[0]; // for in-memory-data-service response
            } else if (isObject(res)) {
                return res || {};
            } else {
                console.error('Unexpected return body.data type: ' + res);
                return {};
            }
        } else {
            console.error('Unexpected return body type: ' + res);
            return {};
        }
    }

    getExchangeByBotId(botId: string): Observable<Exchange> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, ExchangeHttpDataObservableService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .map(ExchangeHttpDataObservableService.extractData)
            .catch(ExchangeHttpDataObservableService.handleError);
    }

    updateExchange(botId: string, exchange: Exchange): Observable<Exchange> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, exchange.id, ExchangeHttpDataObservableService.ENDPOINT_PATH);
        const body = JSON.stringify(exchange);

        return this.http.put(url, body, {headers: headers})
            .map(ExchangeHttpDataObservableService.extractData)
            .catch(ExchangeHttpDataObservableService.handleError);
    }
}
