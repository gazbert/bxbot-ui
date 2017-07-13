import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {AppComponent} from "../../app.component";
import {ExchangeAdapter} from "./exchange-adapter.model";
import {ExchangeAdapterDataObservableService} from "./exchange-adapter-data-observable.service";
import {Observable} from 'rxjs/Observable';
import {isObject} from "rxjs/util/isObject";

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Exchange Adapter Data Service.
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
export class ExchangeAdapterHttpDataObservableService implements ExchangeAdapterDataObservableService {

    private exchangeAdaptersUrl = AppComponent.REST_API_BASE_URL + 'exchangeAdapters';

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
