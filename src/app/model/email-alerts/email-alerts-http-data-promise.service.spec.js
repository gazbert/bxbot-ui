"use strict";
var testing_1 = require("@angular/http/testing");
var http_1 = require("@angular/http");
var testing_2 = require("@angular/core/testing");
var email_alerts_http_data_promise_service_1 = require("./email-alerts-http-data-promise.service");
var email_alerts_model_1 = require("./email-alerts.model");
/**
 * Tests the Email Alerts HTTP Data service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('EmailAlertsHttpDataPromiseService tests using TestBed + Mock HTTP backend', function () {
    beforeEach(testing_2.async(function () {
        testing_2.TestBed.configureTestingModule({
            imports: [http_1.HttpModule],
            providers: [
                email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService,
                { provide: http_1.XHRBackend, useClass: testing_1.MockBackend }
            ]
        })
            .compileComponents().then(function () { });
    }));
    it('should instantiate implementation of EmailAlertsDataService when injected', testing_2.inject([email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService], function (service) {
        expect(service instanceof email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService).toBe(true);
    }));
    it('should instantiate service with "new"', testing_2.inject([http_1.Http], function (http) {
        expect(http).not.toBeNull('http should be provided');
        var service = new email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService(http);
        expect(service instanceof email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService).toBe(true, 'new service should be instance of EmailAlertsDataService');
    }));
    it('should provide the MockBackend as XHRBackend', testing_2.inject([http_1.XHRBackend], function (backend) {
        expect(backend).not.toBeNull('MockBackend backend should be provided');
    }));
    describe('when getEmailAlertsConfigByBotId() operation called with \'1\'', function () {
        var backend;
        var service;
        var fakeEmailAlertsConfig;
        var response;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            backend = be;
            service = new email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService(http);
            fakeEmailAlertsConfig = makeEmailAlertsData();
            var options = new http_1.ResponseOptions({ status: 200, body: { data: fakeEmailAlertsConfig } });
            response = new http_1.Response(options);
        }));
        it('should expect GDAX Email Alerts config', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.getEmailAlertsConfigByBotId(1)
                .then(function (emailAlertsConfig) {
                expect(emailAlertsConfig.id).toBe(1);
                expect(emailAlertsConfig.enabled).toBe(true);
                expect(emailAlertsConfig.smtpHost).toBe('smtp.gmail.com');
                expect(emailAlertsConfig.smtpPort).toBe(587);
                expect(emailAlertsConfig.accountUsername).toBe('bobfett');
                expect(emailAlertsConfig.accountPassword).toBe('iLoveHoth');
                expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
                expect(emailAlertsConfig.toAddress).toBe('jabba@tatooine.space');
            });
        })));
        it('should handle returning no matching Email Alerts config', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 200, body: { undefined: undefined } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.getEmailAlertsConfigByBotId(100) // unknown id
                .then(function (emailAlertsConfig) { return expect(emailAlertsConfig).toBe(undefined, 'should have no Email Alerts config'); });
        })));
    });
    describe('when updateEmailAlertsConfig() operation called', function () {
        var backend;
        var service;
        var response;
        var updatedEmailAlertsConfig;
        beforeEach(testing_2.inject([http_1.Http, http_1.XHRBackend], function (http, be) {
            updatedEmailAlertsConfig = new email_alerts_model_1.EmailAlertsConfig(1, true, 'new.smtp.gmail.com', 589, 'new_bobfett', 'new_iLoveHoth', 'new_jabba@tatooine.space', 'new_boba.fett@hoth.space');
            backend = be;
            service = new email_alerts_http_data_promise_service_1.EmailAlertsHttpDataPromiseService(http);
            var options = new http_1.ResponseOptions({ status: 200, body: { data: updatedEmailAlertsConfig } });
            response = new http_1.Response(options);
        }));
        it('should return updated GDAX Email Alerts config on success', testing_2.async(testing_2.inject([], function () {
            backend.connections.subscribe(function (c) { return c.mockRespond(response); });
            service.updateEmailAlertsConfig(updatedEmailAlertsConfig)
                .then(function (emailAlertsConfig) {
                expect(emailAlertsConfig).toBe(updatedEmailAlertsConfig);
                // paranoia!
                expect(emailAlertsConfig.id).toBe(1);
                expect(emailAlertsConfig.smtpHost).toBe('new.smtp.gmail.com');
            });
        })));
        it('should NOT return Email Alerts config for 401 response', testing_2.async(testing_2.inject([], function () {
            var resp = new http_1.Response(new http_1.ResponseOptions({ status: 401, body: { data: ['Bad request - unknown id'] } }));
            backend.connections.subscribe(function (c) { return c.mockRespond(resp); });
            service.updateEmailAlertsConfig(updatedEmailAlertsConfig)
                .then(function (emailAlertsConfig) { return expect(emailAlertsConfig.id).not.toBeDefined('should not have Email Alerts config'); });
        })));
    });
});
function makeEmailAlertsData() {
    return new email_alerts_model_1.EmailAlertsConfig(1, true, 'smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');
}
//# sourceMappingURL=email-alerts-http-data-promise.service.spec.js.map