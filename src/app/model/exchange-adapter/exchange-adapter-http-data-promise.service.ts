import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {ExchangeAdapter} from "./exchange-adapter.model";
import {ExchangeAdapterDataPromiseService} from "./exchange-adapter-data-promise.service";

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Adapter Data Service.
 * It demonstrates use of Promises in call responses.
 * Seems to be easier to use/understand than Observable approach?
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeAdapterHttpDataPromiseService implements ExchangeAdapterDataPromiseService {

    public exchangeAdaptersUrl = 'app/exchangeAdapters';  // URL to web api
    // vs JSON canned data for quick testing below...
    // private exchangeAdaptersUrl = 'app/exchangeAdapters.json'; // URL to JSON file

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
            .then(response => response.json().data as ExchangeAdapter[])
            .catch(this.handleError);
    }

    update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {
        const url = this.exchangeAdaptersUrl + '/' + exchangeAdapter.id;
        return this.http
            .put(url, JSON.stringify(exchangeAdapter), {headers: this.headers})
            .toPromise()
            // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
            // .then(response => response.json().data as ExchangeAdapter)
            .then(() => exchangeAdapter)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
