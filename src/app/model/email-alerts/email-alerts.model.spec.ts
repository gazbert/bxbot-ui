import {EmailAlertsConfig, SmtpConfig} from './email-alerts.model';

/**
 * Tests the Email Alerts model behaves as expected.
 *
 * @author gazbert
 */
describe('Email Alerts model tests', () => {

    it('should have correct initial values', () => {

        const emailAlertsConfig = new EmailAlertsConfig('bitstamp-1', true,
            new SmtpConfig('smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space'));

        expect(emailAlertsConfig.id).toBe('bitstamp-1');
        expect(emailAlertsConfig.enabled).toBe(true);
        expect(emailAlertsConfig.smtpConfig.smtpHost).toBe('smtp.gmail.com');
        expect(emailAlertsConfig.smtpConfig.smtpPort).toBe(587);
        expect(emailAlertsConfig.smtpConfig.accountUsername).toBe('bobfett');
        expect(emailAlertsConfig.smtpConfig.accountPassword).toBe('iLoveHoth');
        expect(emailAlertsConfig.smtpConfig.toAddress).toBe('jabba@tatooine.space');
        expect(emailAlertsConfig.smtpConfig.fromAddress).toBe('boba.fett@hoth.space');
    });

    it('should clone itself', () => {

        const emailAlertsConfig = new EmailAlertsConfig('bitstamp-2', true,
            new SmtpConfig('smtp.gmail.com', 587, 'bobfett', 'iLoveHoth', 'jabba@tatooine.space', 'boba.fett@hoth.space'));

        const clone = emailAlertsConfig.clone();
        expect(emailAlertsConfig).toEqual(clone);
    });
});
