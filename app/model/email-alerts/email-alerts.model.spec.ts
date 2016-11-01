import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * Tests the Email Alerts model behaves as expected.
 *
 * @author gazbert
 */
describe('Email Alerts config', () => {

    it('has correct initial values', () => {

        const emailAlertsConfig = new EmailAlertsConfig('gdax_email-alerts', 'gdax', true, 'smtp.gmail.com', 587,
            'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');

        expect(emailAlertsConfig.id).toBe('gdax_email-alerts');
        expect(emailAlertsConfig.exchangeId).toBe('gdax');
        expect(emailAlertsConfig.enabled).toBe(true);
        expect(emailAlertsConfig.smtpHost).toBe('smtp.gmail.com');
        expect(emailAlertsConfig.smtpPort).toBe(587);
        expect(emailAlertsConfig.accountUsername).toBe('bobfett');
        expect(emailAlertsConfig.accountPassword).toBe('iLoveHoth');
        expect(emailAlertsConfig.toAddress).toBe('jabba@tatooine.space');
        expect(emailAlertsConfig.fromAddress).toBe('boba.fett@hoth.space');
    });

    it('can clone itself', () => {

        const emailAlertsConfig = new EmailAlertsConfig('gdax_email-alerts', 'gdax', true, 'smtp.gmail.com', 587,
            'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space');

        const clone = emailAlertsConfig.clone();
        expect(emailAlertsConfig).toEqual(clone);
    });
});