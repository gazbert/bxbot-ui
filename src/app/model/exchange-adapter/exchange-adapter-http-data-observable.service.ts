import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {ExchangeAdapter} from "./exchange-adapter.model";
import {ExchangeAdapterDataObservableService} from "./exchange-adapter-data-observable.service";

import {Observable} from 'rxjs/Observable';
// NOTE: We need to explicitly pull the rxjs operators in - if not, we get a stinky runtime error e.g.
// 'Failed: this.http.get(...).map is not a function'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {isObject} from "rxjs/util/isObject";

/**
 * HTTP implementation of the Exchange Adapter Data Service.
 * It demonstrates use of Observables in call responses.
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeAdapterHttpDataObservableService implements ExchangeAdapterDataObservableService {

    public exchangeAdaptersUrl = 'app/exchangeAdapters';  // URL to web api
    // vs JSON canned data for quick testing below...
    //private exchangeUrl = 'app/exchangeAdapters.json'; // URL to JSON file

    constructor(private http: Http) {
    }

    getExchangeAdapters(): Observable<ExchangeAdapter[]> {
        return this.http.get(this.exchangeAdaptersUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getExchangeAdapterByExchangeId(id: string): Observable<ExchangeAdapter> {
        return this.http
            .get(this.exchangeAdaptersUrl + '/' + id)
            .map((r: Response) => r.json().data as ExchangeAdapter)
            .catch(this.handleError);
    }

    update(exchangeAdapter: ExchangeAdapter): Observable<ExchangeAdapter> {
        const url = this.exchangeAdaptersUrl + '/' + exchangeAdapter.id;
        let body = JSON.stringify(exchangeAdapter);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleError (error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead
        return Observable.throw(errMsg);
    }

    private extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();

        if (isObject(body)) { // vs // if (body !== undefined && body !== null) {
            return body.data || {};
        } else {
            return {};
        }
    }
}
