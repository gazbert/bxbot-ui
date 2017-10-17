import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';
import {AppComponent} from '../../app.component';
import {AuthenticationService} from '../../shared/authentication.service';
// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';
import {EngineDataPromiseService} from './engine-data-promise.service';
import {Engine} from './engine.model';

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
export class EngineHttpDataPromiseService implements EngineDataPromiseService {

    private engineUrl = AppComponent.REST_API_BASE_URL + '/engines';

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

        const url = this.engineUrl + '/?botId=' + botId;
        return this.http.get(url, {headers: headers})
            .toPromise()
            .then(response => response.json().data as Engine)
            .catch(EngineHttpDataPromiseService.handleError);
    }

    update(engine: Engine): Promise<Engine> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.engineUrl + '/' + engine.id;
        return this.http
            .put(url, JSON.stringify(engine), {headers: headers})
            .toPromise()
            .then(response => response.json().data as Engine)
            .catch(EngineHttpDataPromiseService.handleError);
    }
}
