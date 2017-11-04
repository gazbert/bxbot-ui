import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {AppComponent} from '../../app.component';
import {EmailAlertsConfig} from './email-alerts.model';
import {EmailAlertsDataPromiseService} from './email-alerts-data-promise.service';
import {AuthenticationService} from '../../shared/authentication.service';

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';
import {isArray, isObject} from 'util';

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
export class EmailAlertsHttpDataPromiseService implements EmailAlertsDataPromiseService {

    private emailAlertsUrl = AppComponent.REST_API_CONFIG_BASE_URL + '/email_alerts';

    constructor(private http: Http) {
    }

    private static handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }

    getEmailAlertsConfigByBotId(botId: string): Promise<EmailAlertsConfig> {

        const headers = new Headers({
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.emailAlertsUrl + '/?botId=' + botId;
        return this.http.get(url, {headers: headers})
            .toPromise()
            // .then(response => response.json().data as EmailAlertsConfig)
            .then(response => {
                const payload = response.json().data;
                if (isArray(payload)) {
                    return payload[0] as EmailAlertsConfig; // for in-memory-data-service response
                } else if (isObject(payload)) {
                    return payload as EmailAlertsConfig || {};
                } else {
                    console.error('Unexpected return body.data type: ' + payload);
                    return {};
                }
            })
            .catch(EmailAlertsHttpDataPromiseService.handleError);
    }

    updateEmailAlertsConfig(emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig> {

        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + AuthenticationService.getToken()
        });

        const url = this.emailAlertsUrl + '/' + emailAlertsConfig.id + '/?botId=' + emailAlertsConfig.id;
        return this.http
            .put(url, JSON.stringify(emailAlertsConfig), {headers: headers})
            .toPromise()
            .then(response => response.json().data as EmailAlertsConfig)
            .catch(EmailAlertsHttpDataPromiseService.handleError);
    }
}
