import {Injectable} from '@angular/core';
import {HttpHeaders, HttpClient} from '@angular/common/http';
import {AuthenticationService, RestApiUrlService} from '../../shared';
import {EngineDataService} from './engine-data.service';
import {Engine} from './engine.model';
import {isArray, isObject} from 'util';
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Engine Data Service.
 *
 * @author gazbert
 */
@Injectable()
export class EngineHttpDataService implements EngineDataService {

    private static ENDPOINT_PATH = '/engine';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred!', error);
        return Promise.reject(error.message || error);
    }

    getEngineByBotId(botId: string): Promise<Engine> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, EngineHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => {
                if (isArray(response)) {
                    return response[0] as Engine; // for in-memory-data-service response
                } else if (isObject(response)) {
                    return response as Engine || {};
                } else {
                    console.error('Unexpected return body.data type: ' + response);
                    return {};
                }
            })
            .catch(EngineHttpDataService.handleError);
    }

    updateEngine(botId: string, engine: Engine): Promise<Engine> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, engine.id, EngineHttpDataService.ENDPOINT_PATH);
        return this.http
            .put(url, engine, {headers: headers})
            .toPromise()
            .then(response => response as Engine)
            .catch(EngineHttpDataService.handleError);
    }
}
