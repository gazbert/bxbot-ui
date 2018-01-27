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

    private static extractData(res: Response) {
        if (res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        return true;
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
            .put(url, market, {headers: headers})
            .toPromise()
            .then(response => response as Market)
            .catch(MarketHttpDataService.handleError);
    }

    deleteMarketById(botId: string, marketId: string): Promise<boolean> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, marketId, MarketHttpDataService.ENDPOINT_PATH);

        return this.http.delete(url, {headers: headers})
            .map(MarketHttpDataService.extractData)
            .catch(MarketHttpDataService.handleError)
            .toPromise();
    }
}
