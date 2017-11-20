import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Market} from './market.model';
import {MarketDataService} from './market-data.service';
import {AuthenticationService} from '../../shared/authentication.service';
import {RestApiUrlService} from '../../shared/rest-api-url.service';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Market Data Service.
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
export class MarketHttpDataService implements MarketDataService {

    private static ENDPOINT_PATH = '/markets';

    constructor(private http: Http) {
    }

    getAllMarketsForBotId(botId: string): Promise<Market[]> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, MarketHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response.json().data as Market[])
            .catch(this.handleError);
    }

    updateMarket(botId: string, market: Market): Promise<Market> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, market.id, MarketHttpDataService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(market), {headers: headers})
            .toPromise()
            .then(response => response.json().data as Market)
            .catch(this.handleError);
    }

    deleteMarketById(botId: string, marketId: string): Promise<boolean> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, marketId, MarketHttpDataService.ENDPOINT_PATH);
        return this.http
            .delete(url, {headers: headers})
            .toPromise()
            .then(response => response.status === 200)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
