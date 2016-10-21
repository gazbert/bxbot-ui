import {Injectable} from "@angular/core";
import {Http, Headers, Response, RequestOptions} from "@angular/http";
import {Exchange} from "../model";
import {ExchangeDataService} from "./exchange-data.service";

import {Observable} from "rxjs";
// NOTE: We need to explicitly pull the rxjs operators in - if not, we get a stinky runtime error e.g.
// 'Failed: this.http.get(...).map is not a function'
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';
import {isObject} from "rxjs/util/isObject";

/**
 * HTTP implementation of the Exchange Data Service.
 *
 * TODO - when to use Promise vs Observable?
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeHttpDataService implements ExchangeDataService {

    public exchangeUrl = 'app/exchanges';  // URL to web api
    // vs JSON canned data for quick testing
    //private exchangeUrl = 'app/exchanges.json'; // URL to JSON file

    constructor(private http: Http) {
    }

    getExchangesUsingPromise(): Promise<Exchange[]> {
        return this.http.get(this.exchangeUrl)
            .toPromise()
            .then(response => response.json().data as Exchange[])
            .catch(this.handleError);
    }

    getExchangesUsingObservable(): Observable<Exchange[]> {
        return this.http.get(this.exchangeUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getExchangeUsingPromise(id: string): Promise<Exchange> {
        return this.getExchangesUsingPromise().then(exchanges => exchanges.find(exchange => exchange.id === id));
    }

    // getExchangeUsingObservable(id: string) {
    //     return this.http
    //         .get('app/exchanges/{id}')
    //         .map((r: Response) => r.json().data as Exchange);
    // }

    private headers = new Headers({'Content-Type': 'application/json'});

    update(exchange: Exchange): Promise<Exchange> {
        const url = `${this.exchangeUrl}/${exchange.id}`;
        return this.http
            .put(url, JSON.stringify(exchange), {headers: this.headers})
            .toPromise()
            .then(() => exchange)
            .catch(this.handleError);
    }

    // TODO update using Observable way
    updateUsingObserver(exchange: Exchange): Observable<Exchange> {
        const url = `${this.exchangeUrl}/${exchange.id}`;
        return this.http
            .put(url, JSON.stringify(exchange), {headers: this.headers})
            .map(this.extractData)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    // TODO handle error the Observable way
    // private handleError (error: any) {
    //     // In a real world app, we might use a remote logging infrastructure
    //     // We'd also dig deeper into the error to get a better message
    //     let errMsg = (error.message) ? error.message :
    //         error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    //     console.error(errMsg); // log to console instead
    //     return Observable.throw(errMsg);
    // }

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
