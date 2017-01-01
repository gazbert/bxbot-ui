import {ActivatedRouteStub} from '../../testing';
import {EmailAlertsComponent} from './email-alerts.component';
import {EmailAlertsConfig} from '../model/email-alerts';

/**
 * Tests the behaviour of the Email Alerts component is as expected.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO Increase coverage for form input validation.
 *
 * @author gazbert
 */
describe('EmailAlertsComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let emailAlertsComponent: EmailAlertsComponent;

    let expectedEmailAlertsConfig: EmailAlertsConfig;
    let expectedUpdatedEmailAlertsConfig: EmailAlertsConfig;

    let spyEmailAlertsConfigDataService: any;
    let router: any;

    beforeEach(done => {

        expectedEmailAlertsConfig = new EmailAlertsConfig('okcoin_email_alerts', 'okcoin', true, 'smtp.gmail.com', 587,
            'yoda', 'DoOrDoNotThereIsNoTry', 'r2d2@naboo.space', 'master.yoda@dagobah.space');

        expectedUpdatedEmailAlertsConfig = new EmailAlertsConfig('okcoin_email_alerts', 'okcoin', true, 'smtp.gmail.com', 587,
            'yoda', 'aNewPassword', 'r2d2@naboo.space', 'yoda.the.boss@dagobah.space');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedEmailAlertsConfig.exchangeId};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyEmailAlertsConfigDataService = jasmine.createSpyObj('EmailAlertsConfigHttpDataPromiseService',
            ['getEmailAlertsConfigForExchange', 'updateEmailAlertsConfig']);
        spyEmailAlertsConfigDataService.getEmailAlertsConfigForExchange.and.returnValue(Promise.resolve(expectedEmailAlertsConfig));
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.and.returnValue(Promise.resolve(expectedUpdatedEmailAlertsConfig));

        emailAlertsComponent = new EmailAlertsComponent(spyEmailAlertsConfigDataService, <any> activatedRoute, router);
        emailAlertsComponent.ngOnInit();

        spyEmailAlertsConfigDataService.getEmailAlertsConfigForExchange.calls.first().returnValue.then(done);
    });

    it('should expose EmailAlertsConfig retrieved from the EmailAlertsDataService', () => {
        expect(emailAlertsComponent.emailAlertsConfig).toBe(expectedEmailAlertsConfig);

        // paranoia ;-)
        expect(emailAlertsComponent.emailAlertsConfig.id).toBe('okcoin_email_alerts');
        expect(emailAlertsComponent.emailAlertsConfig.fromAddress).toBe('master.yoda@dagobah.space');
    });

    it('should navigate when click Cancel', () => {
        emailAlertsComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click Save for valid input', done => {

        expect(emailAlertsComponent.emailAlertsConfig).toBe(expectedEmailAlertsConfig);

        emailAlertsComponent.save(true);
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.first().returnValue
            .then(() => {
                expect(emailAlertsComponent.emailAlertsConfig).toBe(expectedUpdatedEmailAlertsConfig);
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });

    it('should NOT save when click Save for invalid input', () => {
        emailAlertsComponent.save(false);
    });

    it('should navigate when click Save resolves', done => {
        emailAlertsComponent.save(true);

        // waits for async save to complete before navigating
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});
