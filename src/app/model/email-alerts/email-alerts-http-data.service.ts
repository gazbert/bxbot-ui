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
 * @author gazbert
 */
@Injectable()
export class EmailAlertsHttpDataService implements EmailAlertsDataService {

    private static ENDPOINT_PATH = '/email_alerts';

    constructor(private http: HttpClient) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred!', error);
        return Promise.reject(error.message || error);
    }

    getEmailAlertsConfigByBotId(botId: string): Promise<EmailAlertsConfig> {

        const headers = new HttpHeaders({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = RestApiUrlService.buildGetConfigEndpointUrl(botId, EmailAlertsHttpDataService.ENDPOINT_PATH);
        return this.http.get(url, {headers: headers})
            .toPromise()
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
            .put(url, emailAlertsConfig, {headers: headers})
            .toPromise()
            .then(response => response as EmailAlertsConfig)
            .catch(EmailAlertsHttpDataService.handleError);
    }
}
