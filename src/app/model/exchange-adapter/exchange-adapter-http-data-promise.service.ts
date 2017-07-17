import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AppComponent} from "../../app.component";
import {ExchangeAdapter} from "./exchange-adapter.model";
import {ExchangeAdapterDataPromiseService} from "./exchange-adapter-data-promise.service";

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Bot Adapter Data Service.
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

    private exchangeAdaptersUrl = AppComponent.REST_API_BASE_URL + 'exchangeAdapters';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getExchangeAdapters(): Promise<ExchangeAdapter[]> {
        return this.http
            .get(this.exchangeAdaptersUrl)
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter[])
            .catch(this.handleError);
    }

    getExchangeAdapterByExchangeId(id: string): Promise<ExchangeAdapter> {
        return this.http.get(this.exchangeAdaptersUrl + '/' + id)
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter)
            .catch(this.handleError);
    }

    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {
        const url = this.exchangeAdaptersUrl + '/' + exchangeAdapter.id;
        return this.http
            .put(url, JSON.stringify(exchangeAdapter), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as ExchangeAdapter)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
