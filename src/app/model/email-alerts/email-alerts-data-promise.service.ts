import "rxjs/add/operator/toPromise";
import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * The Email Alerts Data Service communicates with the trading bots.
 * The service is used to update the bot's Email Alerts configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface EmailAlertsDataPromiseService {

    getEmailAlertsConfigForExchange(id: string): Promise<EmailAlertsConfig>;
    updateEmailAlertsConfig(emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig>;
}
