import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {EmailAlertsHttpDataService as EmailAlertsDataService} from './email-alerts-http-data.service';
import {EmailAlertsConfig, SmtpConfig} from './email-alerts.model';

/**
 * Tests the Email Alerts HTTP Data service using a mocked HTTP backend.
 *
 * TODO - test non 200 OK responses etc from bxbot-ui-server - UI should handle scenario gracefully!
 *
 * @author gazbert
 */
describe('EmailAlertsHttpDataService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                EmailAlertsDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/
        });
    }));

    it('should instantiate implementation of EmailAlertsDataService when injected',
        inject([EmailAlertsDataService], (service: EmailAlertsDataService) => {
            expect(service instanceof EmailAlertsDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new EmailAlertsDataService(http);
        expect(service instanceof EmailAlertsDataService).toBe(true,
            'new service should be instance of EmailAlertsDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getEmailAlertsConfigByBotId() operation called with \'1\'', () => {

        let backend: MockBackend;
        let service: EmailAlertsDataService;
        let fakeEmailAlertsConfig: EmailAlertsConfig;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EmailAlertsDataService(http);
            fakeEmailAlertsConfig = makeEmailAlertsData();
            const options = new ResponseOptions({status: 200, body: {data: fakeEmailAlertsConfig}});
            response = new Response(options);
        }));

        it('should expect GDAX Email Alerts config', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getEmailAlertsConfigByBotId('gdax-1')
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig.id).toBe('gdax-1');
                    expect(emailAlertsConfig.enabled).toBe(true);
                    expect(emailAlertsConfig.smtpConfig.smtpHost).toBe('smtp.gmail.com');
                    expect(emailAlertsConfig.smtpConfig.smtpPort).toBe(587);
                    expect(emailAlertsConfig.smtpConfig.accountUsername).toBe('bobfett');
                    expect(emailAlertsConfig.smtpConfig.accountPassword).toBe('iLoveHoth');
                    expect(emailAlertsConfig.smtpConfig.fromAddress).toBe('boba.fett@hoth.space');
                    expect(emailAlertsConfig.smtpConfig.toAddress).toBe('jabba@tatooine.space');
                });
        })));

        it('should handle returning no matching Email Alerts config', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getEmailAlertsConfigByBotId('unknown')
                .then(emailAlertsConfig => expect(emailAlertsConfig).not.toBeDefined('should have no Email Alerts config'));
        })));
    });

    describe('when updateEmailAlertsConfig() operation called', () => {

        let backend: MockBackend;
        let service: EmailAlertsDataService;
        let response: Response;
        let updatedEmailAlertsConfig: EmailAlertsConfig;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedEmailAlertsConfig = new EmailAlertsConfig('gdax-1', true,
                new SmtpConfig('new.smtp.gmail.com', 589, 'new_bobfett', 'new_iLoveHoth',
                    'new_jabba@tatooine.space', 'new_boba.fett@hoth.space'));

            backend = be;
            service = new EmailAlertsDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedEmailAlertsConfig}});
            response = new Response(options);
        }));

        it('should return updated GDAX Email Alerts config on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateEmailAlertsConfig('gdax', updatedEmailAlertsConfig)
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig).toBe(updatedEmailAlertsConfig);

                    // paranoia!
                    expect(emailAlertsConfig.id).toBe('gdax-1');
                    expect(emailAlertsConfig.smtpConfig.smtpHost).toBe('new.smtp.gmail.com');
                });
        })));

        it('should NOT return Email Alerts config for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateEmailAlertsConfig('gdax', updatedEmailAlertsConfig)
                .then(emailAlertsConfig => expect(emailAlertsConfig.id).not.toBeDefined('should not have Email Alerts config'));
        })));
    });
});

function makeEmailAlertsData() {
    return new EmailAlertsConfig('gdax-1', true,
        new SmtpConfig('smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space'));
}


