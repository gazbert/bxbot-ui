import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {EmailAlertsHttpDataPromiseService as EmailAlertsDataService} from './email-alerts-http-data-promise.service';
import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * Tests the Email Alerts HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('EmailAlertsHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                EmailAlertsDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of EmailAlertsDataService when injected',
        inject([EmailAlertsDataService], (service: EmailAlertsDataService) => {
            expect(service instanceof EmailAlertsDataService).toBe(true);
    }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new EmailAlertsDataService(http);
        expect(service instanceof EmailAlertsDataService).toBe(true,
            'new service should be instance of EmailAlertsDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));

    describe('when getEmailAlertsConfigForExchange() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: EmailAlertsDataService;
        let fakeEmailAlertsConfig: EmailAlertsConfig[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new EmailAlertsDataService(http);
            fakeEmailAlertsConfig = makeEmailAlertsData();
            let options = new ResponseOptions({status: 200, body: {data: fakeEmailAlertsConfig}});
            response = new Response(options);
        }));

        it('should expect GDAX Email Alerts config', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getEmailAlertsConfigForExchange('gdax')
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig.id).toBe('gdax_email-alerts');
                    expect(emailAlertsConfig.exchangeId).toBe('gdax');
                    expect(emailAlertsConfig.enabled).toBe(true);
                    expect(emailAlertsConfig.smtpHost).toBe('smtp.gmail.com');
                    expect(emailAlertsConfig.smtpPort).toBe(587);
                    expect(emailAlertsConfig.accountUsername).toBe('bobfett');
                    expect(emailAlertsConfig.accountPassword).toBe('iLoveHoth');
                    expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
                    expect(emailAlertsConfig.toAddress).toBe('jabba@tatooine.space');
                });
        })));

        it('should handle returning no matching Email Alerts config', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getEmailAlertsConfigForExchange('unknown')
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig).toBe(undefined, 'should have no Email Alerts config');
                });
        })));

        // TODO - FIXME - getting: 'An error occurred', TypeError{}
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getEmailAlertsConfigForExchange('unknown')
                .then(() => {
                    fail('should not respond with Email Alerts config');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

    describe('when updateEmailAlertsConfig() operation called', () => {

        let backend: MockBackend;
        let service: EmailAlertsDataService;
        let response: Response;
        let updatedEmailAlertsConfig: EmailAlertsConfig;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedEmailAlertsConfig = new EmailAlertsConfig('gdax_email-alerts', 'gdax', true,
                'new.smtp.gmail.com', 589, 'new_bobfett', 'new_iLoveHoth',
                'new_jabba@tatooine.space', 'new_boba.fett@hoth.space');

            backend = be;
            service = new EmailAlertsDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: updatedEmailAlertsConfig}});
            response = new Response(options);
        }));

        it('should return updated GDAX Email Alerts config', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateEmailAlertsConfig(updatedEmailAlertsConfig)
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig).toBe(updatedEmailAlertsConfig);

                    // paranoia!
                    expect(emailAlertsConfig.id).toBe('gdax_email-alerts');
                    expect(emailAlertsConfig.exchangeId).toBe('gdax');
                    expect(emailAlertsConfig.smtpHost).toBe('new.smtp.gmail.com');
                });
        })));

        // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
        xit('should handle returning no matching Email Alerts config', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateEmailAlertsConfig(updatedEmailAlertsConfig)
                .then(emailAlertsConfig => {
                    expect(emailAlertsConfig).toBe(undefined, 'should have no Email Alerts config');
                });
        })));

        // TODO - FIXME - MockResponse does not seem to return response for the PUT - I'm missing something...
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.updateEmailAlertsConfig(updatedEmailAlertsConfig)
                .then(() => {
                    fail('should not respond with Email Alerts config');
                })
                .catch(err => {
                    expect(err).toMatch(/Cannot read property 'data' of null/, 'should catch bad response status code');
                });
        })));
    });

});

const makeEmailAlertsData = () => [

    new EmailAlertsConfig('gdax_email-alerts', 'gdax', true, 'smtp.gmail.com', 587,
        'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space')

] as EmailAlertsConfig[];


