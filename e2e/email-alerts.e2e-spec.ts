/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Email Alerts screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ******************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Email Alert Config screen tests.
 *
 * TODO - Test code seems very brittle: can we have access to the model please Angular :-)
 *
 * @author gazbert
 */
describe('Email Alerts Config Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should update Email Alerts fields after Save', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        let emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        let accountUsername = element(by.id('accountUsername'));
        let newAccountUsername = 'solo';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        let accountPassword = element(by.id('accountPassword'));
        let newAccountPassword = 'falcon123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        let retypeAccountPassword = element(by.id('retypeAccountPassword'));
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(newAccountPassword);
        expect(retypeAccountPassword.getAttribute('value')).toBe(newAccountPassword);

        let toAddress = element(by.id('toAddress'));
        let newToAddress = 'luke@tatooine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        let fromAddress = element(by.id('fromAddress'));
        let newFromAddress = 'han@falcon.space';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Save and check the update worked
        let saveButton = element(by.id('emailAlertSaveButton'));
        saveButton.click();
        dashboardItems.get(2).click();
        tabLinks.get(3).click();

        // Email Alerts config updated
        expect(element(by.id('alertsEnabled')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe(newAccountUsername);
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe(newAccountPassword);
        expect(element(by.id('toAddress')).getAttribute('value')).toBe(newToAddress);
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe(newFromAddress);
    });

    it('should NOT update Email Alerts fields after Cancel', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        let emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        let accountUsername = element(by.id('accountUsername'));
        let newAccountUsername = 'solo';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        let accountPassword = element(by.id('accountPassword'));
        let newAccountPassword = 'falcon123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        let retypeAccountPassword = element(by.id('retypeAccountPassword'));
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(newAccountPassword);
        expect(retypeAccountPassword.getAttribute('value')).toBe(newAccountPassword);

        let toAddress = element(by.id('toAddress'));
        let newToAddress = 'luke@tatooine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        let fromAddress = element(by.id('fromAddress'));
        let newFromAddress = 'han@falcon.space';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Cancel and check the update did not persist
        let cancelButton = element(by.id('emailAlertCancelButton'));
        cancelButton.click();
        dashboardItems.get(2).click();
        tabLinks.get(3).click();

        // Email Alerts config unchanged
        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');
    });

    it('should NOT save Email Alerts config fields if there are validation errors', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields with some 'bad' values
        let emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        let accountUsername = element(by.id('accountUsername'));
        let newAccountUsername = '@solo ~';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        let accountPassword = element(by.id('accountPassword'));
        let newAccountPassword = '!falcon%123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        let retypeAccountPassword = element(by.id('retypeAccountPassword'));
        let confirmedPasswordValidButDifferent = 'confirmedPasswordValidButDifferent';
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(confirmedPasswordValidButDifferent);
        expect(retypeAccountPassword.getAttribute('value')).toBe(confirmedPasswordValidButDifferent);

        let toAddress = element(by.id('toAddress'));
        let newToAddress = '#luke@tatoo ine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        let fromAddress = element(by.id('fromAddress'));
        let newFromAddress = 'han~falcon.space%';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Save and check the update did not persist
        let saveButton = element(by.id('emailAlertSaveButton'));
        saveButton.click();

        // Email Alerts config - check for validation errors
        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');

        expect(element(by.id('accountUsername')).getAttribute('value')).toBe(newAccountUsername);
        expect(element(by.id('invalidAccountUsername')).getText()).toBe(
            'Account Username must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('accountPassword')).getAttribute('value')).toBe(newAccountPassword);
        expect(element(by.id('invalidAccountPassword')).getText()).toBe(
            'Account Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $');

        expect(element(by.id('retypeAccountPassword')).getAttribute('value')).toBe(confirmedPasswordValidButDifferent);
        expect(element(by.id('invalidRetypeAccountPassword')).getText()).toBe('Passwords must match.');

        expect(element(by.id('toAddress')).getAttribute('value')).toBe(newToAddress);
        expect(element(by.id('invalidToAddress')).getText()).toBe(
            'Valid email To Address is required, e.g. solo@falcon.com');

        expect(element(by.id('fromAddress')).getAttribute('value')).toBe(newFromAddress)
        expect(element(by.id('invalidFromAddress')).getText()).toBe(
            'Valid email From Address is required, e.g. boba@hoth.com');
    });
});
