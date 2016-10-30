import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {ExchangeDataPromiseService} from "./exchange-data-promise.service";
import {Exchange} from "./exchange.model";

// *** Don't forget this else you get runtime error!
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Data Service.
 *
 * It demonstrates use of Promises in call responses. Seems to be easier to use/understand than Observable way?
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeHttpDataPromiseService implements ExchangeDataPromiseService {

    public exchangeUrl = 'app/exchanges';  // URL to web api
    // vs JSON canned data for quick testing
    //private exchangeUrl = 'app/exchanges.json'; // URL to JSON file

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getExchanges(): Promise<Exchange[]> {
        return this.http.get(this.exchangeUrl)
            .toPromise()
            .then(response => response.json().data as Exchange[])
            .catch(this.handleError);
    }

    getExchange(id: string): Promise<Exchange> {
        return this.getExchanges().then(exchanges => exchanges.find(exchange => exchange.id === id));
    }

    update(exchange: Exchange): Promise<Exchange> {
        const url = `${this.exchangeUrl}/${exchange.id}`;
        return this.http
            .put(url, JSON.stringify(exchange), {headers: this.headers})
            .toPromise()
            .then(() => exchange)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
