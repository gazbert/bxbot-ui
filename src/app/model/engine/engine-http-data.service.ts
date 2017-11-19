import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {AuthenticationService} from '../../shared/authentication.service';
import {EngineDataService} from './engine-data.service';
import {Engine} from './engine.model';
import {isArray, isObject} from 'util';
import {RestApiUrlService} from '../../shared/rest-api-url.service';
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Engine Data Service.
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
export class EngineHttpDataService implements EngineDataService {

    private static ENDPOINT_PATH = '/engine';

    constructor(private http: Http) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getEngineByBotId(botId: string): Promise<Engine> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, EngineHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => {

                // TODO - upgrade HTTP to get rid of json() stuff + upgrade in-memory-data-service to get rid of data wrapper
                const payload = response.json().data;
                if (isArray(payload)) {
                    return payload[0] as Engine; // for in-memory-data-service response
                } else if (isObject(payload)) {
                    return payload as Engine || {};
                } else {
                    console.error('Unexpected return body.data type: ' + payload);
                    return {};
                }
            })
            .catch(EngineHttpDataService.handleError);
    }

    updateEngine(botId: string, engine: Engine): Promise<Engine> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, EngineHttpDataService.ENDPOINT_PATH) + '/' + engine.id;
        return this.http
            .put(url, JSON.stringify(engine), {headers: headers})
            .toPromise()
            // TODO - upgrade HTTP to get rid of json() stuff + upgrade in-memory-data-service to get rid of data wrapper
            .then(response => response.json().data as Engine)
            .catch(EngineHttpDataService.handleError);
    }
}
