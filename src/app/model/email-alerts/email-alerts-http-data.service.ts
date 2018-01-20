import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {EmailAlertsConfig} from './email-alerts.model';
import {EmailAlertsDataService} from './email-alerts-data.service';
import {AuthenticationService, RestApiUrlService} from '../../shared';
import {isArray, isObject} from 'util';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Email Alerts Data Service.
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
export class EmailAlertsHttpDataService implements EmailAlertsDataService {

    private static ENDPOINT_PATH = '/email_alerts';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getEmailAlertsConfigByBotId(botId: string): Promise<EmailAlertsConfig> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, EmailAlertsHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
            // .then(response => response.json().data as EmailAlertsConfig)
            .then(response => {
                if (isArray(response)) {
                    return response[0] as EmailAlertsConfig; // for in-memory-data-service response
                } else if (isObject(response)) {
                    return response as EmailAlertsConfig || {};
                } else {
                    console.error('Unexpected return body.data type: ' + response);
                    return {};
                }
            })
            .catch(EmailAlertsHttpDataService.handleError);
    }

    updateEmailAlertsConfig(botId: string, emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig> {

        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildUpdateConfigEndpointUrl(botId, emailAlertsConfig.id, EmailAlertsHttpDataService.ENDPOINT_PATH);
        return this.http
            .put(url, JSON.stringify(emailAlertsConfig), {headers: headers})
            .toPromise()
            .then(response => response as EmailAlertsConfig)
            .catch(EmailAlertsHttpDataService.handleError);
    }
}
