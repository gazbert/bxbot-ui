"use strict";
var testing_1 = require("../../testing");
var email_alerts_component_1 = require("./email-alerts.component");
var email_alerts_1 = require("../model/email-alerts");
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
describe('EmailAlertsComponent tests without TestBed', function () {
    var activatedRoute;
    var emailAlertsComponent;
    var expectedEmailAlertsConfig;
    var expectedUpdatedEmailAlertsConfig;
    var spyEmailAlertsConfigDataService;
    var router;
    beforeEach(function (done) {
        expectedEmailAlertsConfig = new email_alerts_1.EmailAlertsConfig(2, true, 'smtp.gmail.com', 587, 'yoda', 'DoOrDoNotThereIsNoTry', 'r2d2@naboo.space', 'master.yoda@dagobah.space');
        expectedUpdatedEmailAlertsConfig = new email_alerts_1.EmailAlertsConfig(2, true, 'smtp.gmail.com', 587, 'yoda', 'aNewPassword', 'r2d2@naboo.space', 'yoda.the.boss@dagobah.space');
        activatedRoute = new testing_1.ActivatedRouteStub();
        activatedRoute.testParams = { id: expectedEmailAlertsConfig.id };
        router = jasmine.createSpyObj('router', ['navigate']);
        spyEmailAlertsConfigDataService = jasmine.createSpyObj('EmailAlertsConfigHttpDataPromiseService', ['getEmailAlertsConfigByBotId', 'updateEmailAlertsConfig']);
        spyEmailAlertsConfigDataService.getEmailAlertsConfigByBotId.and.returnValue(Promise.resolve(expectedEmailAlertsConfig));
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.and.returnValue(Promise.resolve(expectedUpdatedEmailAlertsConfig));
        emailAlertsComponent = new email_alerts_component_1.EmailAlertsComponent(spyEmailAlertsConfigDataService, activatedRoute, router);
        emailAlertsComponent.ngOnInit();
        spyEmailAlertsConfigDataService.getEmailAlertsConfigByBotId.calls.first().returnValue.then(done);
    });
    it('should expose EmailAlertsConfig retrieved from the EmailAlertsDataService', function () {
        expect(emailAlertsComponent.emailAlertsConfig).toBe(expectedEmailAlertsConfig);
        // paranoia ;-)
        expect(emailAlertsComponent.emailAlertsConfig.id).toBe(2);
        expect(emailAlertsComponent.emailAlertsConfig.fromAddress).toBe('master.yoda@dagobah.space');
    });
    it('should save and navigate to Dashboard when user clicks Save for valid input', function (done) {
        emailAlertsComponent.save(true);
        spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.first().returnValue
            .then(function (updatedEmailAlertConfig) {
            expect(updatedEmailAlertConfig).toBe(expectedUpdatedEmailAlertsConfig);
            expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
            done();
        });
    });
    it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
        emailAlertsComponent.cancel();
        expect(spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });
    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
        emailAlertsComponent.save(false);
        expect(spyEmailAlertsConfigDataService.updateEmailAlertsConfig.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
});
//# sourceMappingURL=email-alerts-component-notestbed.spec.js.map