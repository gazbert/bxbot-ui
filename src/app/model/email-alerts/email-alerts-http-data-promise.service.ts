import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AppComponent} from "../../app.component";
import {EmailAlertsConfig} from "./email-alerts.model";
import {EmailAlertsDataPromiseService} from "./email-alerts-data-promise.service";

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
export class EmailAlertsHttpDataPromiseService implements EmailAlertsDataPromiseService {

    private emailAlertsUrl = AppComponent.REST_API_BASE_URL + '/emailAlerts';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getEmailAlertsConfigForExchange(exchangeId: string): Promise<EmailAlertsConfig> {
        const url = this.emailAlertsUrl + '?exchangeId=' + exchangeId; // TODO - use botId for FK
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as EmailAlertsConfig[])
            .then(emailAlertsConfigs => emailAlertsConfigs.find(emailAlertsConfig => emailAlertsConfig.exchangeId == exchangeId))
            .catch(this.handleError);
    }

    updateEmailAlertsConfig(emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig> {
        const url = this.emailAlertsUrl + '/' + emailAlertsConfig.id;
        return this.http
            .put(url, JSON.stringify(emailAlertsConfig), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as EmailAlertsConfig)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
