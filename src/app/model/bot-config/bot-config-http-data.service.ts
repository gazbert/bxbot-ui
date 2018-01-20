import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AuthenticationService, RestApiUrlService} from '../../shared';
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';
import {BotConfigDataService} from './bot-config-data.service';
import {BotConfig} from './bot-config.model';

/**
 * HTTP implementation of the BotConfig Data Service.
 *
 * @author gazbert
 */
@Injectable()
export class BotConfigHttpDataService implements BotConfigDataService {

    private static ENDPOINT_PATH = RestApiUrlService.REST_API_CONFIG_URL_PATH;

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getAllBotConfig(): Promise<BotConfig[]> {

        const headers = new HttpHeaders()
            .set('Authorization', 'Bearer ' + AuthenticationService.getToken()
            );

        return this.http.get(BotConfigHttpDataService.ENDPOINT_PATH, {headers: headers})
            .toPromise()
            .then(response => response as BotConfig[])
            .catch(BotConfigHttpDataService.handleError);
    }

    updateBotConfig(botId: string, botConfig: BotConfig): Promise<BotConfig> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = BotConfigHttpDataService.ENDPOINT_PATH + botId;
        return this.http
            .put(url, botConfig, {headers: headers})
            .toPromise()
            .then(response => response as BotConfig)
            .catch(BotConfigHttpDataService.handleError);
    }

    deleteBotConfigById(botId: string): Promise<boolean> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = BotConfigHttpDataService.ENDPOINT_PATH + botId;

        let result;
        this.http.delete(url, {observe: 'response', headers: headers})
            .subscribe(resp => {
                console.log(resp);
                result = resp.ok;
            });

        return new Promise((resolve, reject) => {
            resolve(result);
        });
    }
}
