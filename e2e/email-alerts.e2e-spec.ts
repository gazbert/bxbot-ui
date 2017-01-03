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
 * Test code seems very brittle - we need access to the model please Angular!
 *
 * TODO - Tests for updating/validating fields
 */
describe('Email Alerts Config Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render Gemini Email Alerts config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy!');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');
    });

    it('Should update Email Alerts fields after Save', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy!');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        let emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe(null); // must be better way?

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
        expect(element(by.id('alertsEnabled')).getAttribute('ng-reflect-model')).toBe(null); // must be better way?
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe(newAccountUsername);
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe(newAccountPassword);
        expect(element(by.id('toAddress')).getAttribute('value')).toBe(newToAddress);
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe(newFromAddress);
    });

    it('Should NOT update Email Alerts fields after Cancel', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy!');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        let emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe(null); // must be better way?

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
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy!');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');
    });
});
