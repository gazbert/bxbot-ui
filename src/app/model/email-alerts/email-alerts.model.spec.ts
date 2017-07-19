import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * Tests the Email Alerts model behaves as expected.
 *
 * @author gazbert
 */
describe('Email Alerts model tests', () => {

    it('should have correct initial values', () => {

        const emailAlertsConfig = new EmailAlertsConfig(1, true, 'smtp.gmail.com', 587,
            'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');

        expect(emailAlertsConfig.id).toBe(1);
        expect(emailAlertsConfig.enabled).toBe(true);
        expect(emailAlertsConfig.smtpHost).toBe('smtp.gmail.com');
        expect(emailAlertsConfig.smtpPort).toBe(587);
        expect(emailAlertsConfig.accountUsername).toBe('bobfett');
        expect(emailAlertsConfig.accountPassword).toBe('iLoveHoth');
        expect(emailAlertsConfig.toAddress).toBe('jabba@tatooine.space');
        expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
    });

    it('should clone itself', () => {

        const emailAlertsConfig = new EmailAlertsConfig(1, true, 'smtp.gmail.com', 587,
            'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');

        const clone = emailAlertsConfig.clone();
        expect(emailAlertsConfig).toEqual(clone);
    });
});