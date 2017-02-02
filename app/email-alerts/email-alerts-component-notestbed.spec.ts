import {ActivatedRouteStub} from '../../testing';
import {EmailAlertsComponent} from './email-alerts.component';
import {EmailAlertsConfig} from '../model/email-alerts';

/**
 * Tests the behaviour of the Email Alerts component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
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

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        emailAlertsComponent.save(true);
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.first().returnValue
            .then((updatedEmailAlertConfig) => {
                expect(updatedEmailAlertConfig).toBe(expectedUpdatedEmailAlertsConfig);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        emailAlertsComponent.cancel();
        expect(spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        emailAlertsComponent.save(false);
        expect(spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
});

