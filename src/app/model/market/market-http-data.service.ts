import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
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

    // TODO - this needs sorting out!
    deleteMarketById(botId: string, marketId: string): Promise<boolean> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, marketId, MarketHttpDataService.ENDPOINT_PATH);

        this.http.delete(url, {headers: headers})
            .subscribe(
                data => {
                },
                (err: HttpErrorResponse) => {
                    if (err.error instanceof Error) {
                        // A client-side or network error occurred. Handle it accordingly.
                        console.log('An error occurred:', err.error.message);
                    } else {
                        // The backend returned an unsuccessful response code.
                        // The response body may contain clues as to what went wrong,
                        console.log(`Backend returned code ${err.status}, body was: ${err.error}`);
                    }
                }
            );
        return Promise.resolve(true);
    }
}
