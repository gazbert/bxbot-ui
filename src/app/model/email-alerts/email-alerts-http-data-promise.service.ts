import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {EmailAlertsConfig} from "./email-alerts.model";
import {EmailAlertsDataPromiseService} from "./email-alerts-data-promise.service";

// *** Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Email Alerts Data Service.
 * It demonstrates use of Promises in call responses.
 * Seems easier to use/understand than Observable way?
 *
 * @author gazbert
 */
@Injectable()
export class EmailAlertsHttpDataPromiseService implements EmailAlertsDataPromiseService {

    public emailAlertsUrl = 'app/emailAlerts';  // URL to web api
    // vs JSON canned data for quick testing below...
    // private emailAlertsUrl = 'app/emailAlerts.json'; // URL to JSON file

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getEmailAlertsConfigForExchange(exchangeId: string): Promise<EmailAlertsConfig> {
        const url = this.emailAlertsUrl + '?exchangeId=' + exchangeId;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as EmailAlertsConfig[])
            .then(emailAlertsConfigs => emailAlertsConfigs.find(emailAlertsConfig => emailAlertsConfig.exchangeId === exchangeId))
            .catch(this.handleError);
    }

    updateEmailAlertsConfig(emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig> {
        const url = this.emailAlertsUrl + '/' + emailAlertsConfig.id;
        return this.http
            .put(url, JSON.stringify(emailAlertsConfig), {headers: this.headers})
            .toPromise()
            // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
            // .then(response => response.json().data as EmailAlertsConfig)
            .then(() => emailAlertsConfig)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
