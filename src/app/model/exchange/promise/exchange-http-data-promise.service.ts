import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppComponent} from '../../../app.component';
import {Exchange} from '../exchange.model';
import {ExchangeDataPromiseService} from './exchange-data-promise.service';
import {AuthenticationService} from '../../../shared/authentication.service';

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

    private exchangesUrl = AppComponent.REST_API_CONFIG_BASE_URL + '/exchanges';

    constructor(private http: Http) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getExchangeByBotId(botId: string): Promise<Exchange> {
        const url = this.exchangesUrl + '/' + botId;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }

    update(exchange: Exchange): Promise<Exchange> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.exchangesUrl + '/' + exchange.id;
        return this.http
            .put(url, JSON.stringify(exchange), {headers: headers})
            .toPromise()
            .then(response => response.json().data as Exchange)
            .catch(ExchangeHttpDataPromiseService.handleError);
    }
}
