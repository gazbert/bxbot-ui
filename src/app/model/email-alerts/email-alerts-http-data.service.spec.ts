import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HttpClient} from '@angular/common/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {EmailAlertsHttpDataService as EmailAlertsDataService} from './email-alerts-http-data.service';
import {EmailAlertsConfig, SmtpConfig} from './email-alerts.model';

/**
 * Tests the Email Alerts HTTP Data service using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('EmailAlertsHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [EmailAlertsDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getEmailAlertsConfigByBotId() operation called with \'gdax-1\'', () => {

        let backend: HttpTestingController;
        let service: EmailAlertsDataService;
        let emailAlertsConfig: EmailAlertsConfig;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new EmailAlertsDataService(http);
            emailAlertsConfig = makeEmailAlertsData();
        }));

        it('should expect GDAX Email Alerts config', async(inject([], () => {

            service.getEmailAlertsConfigByBotId('gdax-1')
                .then(response => {
                    expect(response).toBe(emailAlertsConfig);

                    // paranoia!
                    expect(response.smtpConfig.accountUsername).toEqual('bobfett');
                });

            backend.expectOne({
                url: 'app/email_alerts?botId=gdax-1',
                method: 'GET'
            }).flush(emailAlertsConfig, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no matching Email Alerts config', async(inject([], () => {

            service.getEmailAlertsConfigByBotId('gdax-unknown')
                .then(engine => {
                    expect(engine).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/email_alerts?botId=gdax-unknown',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when updateEmailAlertsConfig() operation called', () => {

        let backend: HttpTestingController;
        let service: EmailAlertsDataService;
        let updatedEmailAlertsConfig: EmailAlertsConfig;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {

            updatedEmailAlertsConfig = new EmailAlertsConfig('gdax-1', true,
                new SmtpConfig('new.smtp.gmail.com', 589, 'new_bobfett', 'new_iLoveHoth',
                    'new_jabba@tatooine.space', 'new_boba.fett@hoth.space'));

            backend = testController;
            service = new EmailAlertsDataService(http);
        }));

        it('should return updated GDAX Email Alerts config on success', async(inject([], () => {

            service.updateEmailAlertsConfig('gdax-1', updatedEmailAlertsConfig)
                .then(response => {
                    expect(response).toBe(updatedEmailAlertsConfig);

                    // paranoia!
                    expect(response.smtpConfig.accountUsername).toBe('new_bobfett');
                });

            backend.expectOne({
                url: 'app/email_alerts/gdax-1',
                method: 'PUT'
            }).flush(updatedEmailAlertsConfig, {status: 200, statusText: 'Ok'});

        })));

        it('should NOT return Email Alerts config for 401 response', async(inject([], () => {

            const unknownEmailAlertsConfig = new EmailAlertsConfig('gdax-unknown', true,
                new SmtpConfig('new.smtp.gmail.com', 589, 'new_bobfett', 'new_iLoveHoth',
                    'new_jabba@tatooine.space', 'new_boba.fett@hoth.space'));

            service.updateEmailAlertsConfig('gdax-unknown', unknownEmailAlertsConfig)
                .then(response => {
                    expect(response.smtpConfig).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/email_alerts/gdax-unknown',
                method: 'PUT'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });
});

function makeEmailAlertsData() {
    return new EmailAlertsConfig('gdax-1', true,
        new SmtpConfig('smtp.gmail.com', 587, 'bobfett', 'iLoveHoth',
            'jabba@tatooine.space', 'boba.fett@hoth.space'));
}


