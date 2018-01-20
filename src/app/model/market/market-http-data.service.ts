import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Market} from './market.model';
import {MarketDataService} from './market-data.service';
import {AuthenticationService, RestApiUrlService} from '../../shared';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Market Data Service.
 *
 * @author gazbert
 */
@Injectable()
export class MarketHttpDataService implements MarketDataService {

    private static ENDPOINT_PATH = '/markets';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred!', error);
        return Promise.reject(error.message || error);
    }

    getAllMarketsForBotId(botId: string): Promise<Market[]> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, MarketHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response as Market[])
            .catch(MarketHttpDataService.handleError);
    }

    updateMarket(botId: string, market: Market): Promise<Market> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, market.id, MarketHttpDataService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(market), {headers: headers})
            .toPromise()
            .then(response => response as Market)
            .catch(MarketHttpDataService.handleError);
    }

    deleteMarketById(botId: string, marketId: string): Promise<boolean> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, marketId, MarketHttpDataService.ENDPOINT_PATH);

        let result;
        this.http.delete(url, {observe: 'response', headers: headers})
            .subscribe(resp => {
                console.log(resp);
                result = resp.ok;
            });

        return new Promise((resolve, reject) => {
            resolve(result);
        });

        // return this.http
        //     .delete(url, {headers: headers})
        //     .toPromise()
        //     .then(response => response.status === 200)
        //     .catch(MarketHttpDataService.handleError);
    }
}
