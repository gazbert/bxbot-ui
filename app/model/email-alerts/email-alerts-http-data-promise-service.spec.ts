import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {EmailAlertsHttpDataPromiseService as EmailAlertsDataService} from './email-alerts-http-data-promise.service';
import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * Tests the Email Alerts HTTP service (Promise flavour) using a mocked HTTP backend.
 * TODO tests for updateEmailAlertsConfig()
 *
 * @author gazbert
 */
describe('EmailAlertsHttpDataPromiseService tests using TestBed and Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                EmailAlertsDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('should instantiate service when inject service',
        inject([EmailAlertsDataService], (service: EmailAlertsDataService) => {
            expect(service instanceof EmailAlertsDataService).toBe(true);
    }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new EmailAlertsDataService(http);
        expect(service instanceof EmailAlertsDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about? Are we just testing Angular here?
    it('should provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
    }));

    describe('when getEmailAlertsConfigForExchange called', () => {

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
                    expect(emailAlertsConfig.exchangeId).toBe('gdax');
                    expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
                });
        })));

        it('should be OK returning no matching Email Alerts config', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getEmailAlertsConfigForExchange('muh')
                .then(markets => {
                    expect(markets).toBe(undefined, 'should have no Email Alerts config');
                });
        })));

        // TODO FIXME
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getEmailAlertsConfigForExchange('muh')
                .then(() => {
                    fail('should not respond with Email Alerts config');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                });
        })));
    });
});

const makeEmailAlertsData = () => [

    new EmailAlertsConfig('gdax_email-alerts', 'gdax', true, 'smtp.gmail.com', 587,
        'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space')

] as EmailAlertsConfig[];


