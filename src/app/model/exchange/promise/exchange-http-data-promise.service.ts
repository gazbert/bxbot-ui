import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Exchange} from '../exchange.model';
import {ExchangeDataPromiseService} from './exchange-data-promise.service';
import {AuthenticationService, RestApiUrlService} from '../../../shared';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Data Service.
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
export class ExchangeHttpDataPromiseService implements ExchangeDataPromiseService {

    private static ENDPOINT_PATH = '/exchange';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred!', error);
        return Promise.reject(error.message || error);
    }

    getExchangeByBotId(botId: string): Promise<Exchange> {
        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, ExchangeHttpDataPromiseService.ENDPOINT_PATH);
        return this.http.get(url)
            .toPromise()
            .then(response => response as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }

    updateExchange(botId: string, exchange: Exchange): Promise<Exchange> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, exchange.id, ExchangeHttpDataPromiseService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(exchange), {headers: headers})
            .toPromise()
            .then(response => response as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }
}
