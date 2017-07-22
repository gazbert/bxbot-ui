"use strict";
var email_alerts_model_1 = require("./email-alerts.model");
/**
 * Tests the Email Alerts model behaves as expected.
 *
 * @author gazbert
 */
describe('Email Alerts model tests', function () {
    it('should have correct initial values', function () {
        var emailAlertsConfig = new email_alerts_model_1.EmailAlertsConfig(1, true, 'smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');
        expect(emailAlertsConfig.id).toBe(1);
        expect(emailAlertsConfig.enabled).toBe(true);
        expect(emailAlertsConfig.smtpHost).toBe('smtp.gmail.com');
        expect(emailAlertsConfig.smtpPort).toBe(587);
        expect(emailAlertsConfig.accountUsername).toBe('bobfett');
        expect(emailAlertsConfig.accountPassword).toBe('iLoveHoth');
        expect(emailAlertsConfig.toAddress).toBe('jabba@tatooine.space');
        expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
    });
    it('should clone itself', function () {
        var emailAlertsConfig = new email_alerts_model_1.EmailAlertsConfig(1, true, 'smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');
        var clone = emailAlertsConfig.clone();
        expect(emailAlertsConfig).toEqual(clone);
    });
});
//# sourceMappingURL=email-alerts.model.spec.js.map