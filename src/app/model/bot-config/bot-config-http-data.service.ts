import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {AuthenticationService} from '../../shared/authentication.service';
import {RestApiUrlService} from '../../shared/rest-api-url.service';
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';
import {BotConfigDataService} from './bot-config-data.service';
import {BotConfig} from './bot-config.model';

/**
 * HTTP implementation of the BotConfig Data Service.
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
export class BotConfigHttpDataService implements BotConfigDataService {

    private static ENDPOINT_PATH = RestApiUrlService.REST_API_CONFIG_URL_PATH;

    constructor(private http: Http) {
    }

    getAllBotConfig(): Promise<BotConfig[]> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        return this.http.get(BotConfigHttpDataService.ENDPOINT_PATH, {headers: headers})
            .toPromise()
            .then(response => response.json().data as BotConfig[])
            .catch(this.handleError);
    }

    updateBotConfig(botId: string, botConfig: BotConfig): Promise<BotConfig> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = BotConfigHttpDataService.ENDPOINT_PATH + '/' + botId;
        return this.http
            .put(url, JSON.stringify(botConfig), {headers: headers})
            .toPromise()
            .then(response => response.json().data as BotConfig)
            .catch(this.handleError);
    }

    deleteBotConfigById(botId: string): Promise<boolean> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = BotConfigHttpDataService.ENDPOINT_PATH + '/' + botId;
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
