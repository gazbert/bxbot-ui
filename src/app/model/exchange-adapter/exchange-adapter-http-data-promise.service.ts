import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppComponent} from '../../app.component';
import {ExchangeAdapter} from './exchange-adapter.model';
import {ExchangeAdapterDataPromiseService} from './exchange-adapter-data-promise.service';
import {AuthenticationService} from '../../shared/authentication.service';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Adapter Data Service.
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
export class ExchangeAdapterHttpDataPromiseService implements ExchangeAdapterDataPromiseService {

    private exchangeAdaptersUrl = AppComponent.REST_API_BASE_URL + '/exchangeAdapters';

    constructor(private http: Http) {
    }

    getExchangeAdapters(): Promise<ExchangeAdapter[]> {

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        return this.http
            .get(this.exchangeAdaptersUrl, {headers: headers})
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter[])
            .catch(ExchangeAdapterHttpDataPromiseService.handleError);
    }

    getExchangeAdapterByBotId(botId: number): Promise<ExchangeAdapter> {
        const url = this.exchangeAdaptersUrl + '?botId=' + botId;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter[])
            .then(exchangeAdapters => exchangeAdapters.find(exchangeAdapter => exchangeAdapter.botId == botId))
            .catch(ExchangeAdapterHttpDataPromiseService.handleError);
    }

    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {

        let headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.exchangeAdaptersUrl + '/' + exchangeAdapter.id;
        return this.http
            .put(url, JSON.stringify(exchangeAdapter), {headers: headers})
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter)
            .catch(ExchangeAdapterHttpDataPromiseService.handleError);
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
