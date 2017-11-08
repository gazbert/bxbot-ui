import 'rxjs/add/operator/toPromise';
import {EmailAlertsConfig} from './email-alerts.model';

/**
 * The Email Alerts Data Service provides operations to update Email Alerts configuration.
 * It uses Promises in the operation responses.
 *
 * @author gazbert
 */
export interface EmailAlertsDataService {

    getEmailAlertsConfigByBotId(botId: string): Promise<EmailAlertsConfig>;

    updateEmailAlertsConfig(emailAlertsConfig: EmailAlertsConfig): Promise<EmailAlertsConfig>;
}
