import {browser, element, by, protractor} from 'protractor';

/**
 * Email Alert screen tests.
 *
 * End 2 End Protractor tests (using Jasmine) for testing Email Alerts screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * @author gazbert
 */
describe('Email Alerts Tests', function () {

    const WAIT_TIMEOUT = 120000;

    beforeEach(function () {
        browser.get('');
    });

    it('should update Email Alerts fields after Save', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        // https://stackoverflow.com/questions/28464604/more-than-one-element-found-for-locator-warning
        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(4).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        const emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        const accountUsername = element(by.id('accountUsername'));
        const newAccountUsername = 'solo';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        const accountPassword = element(by.id('accountPassword'));
        const newAccountPassword = 'falcon123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        const retypeAccountPassword = element(by.id('retypeAccountPassword'));
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(newAccountPassword);
        expect(retypeAccountPassword.getAttribute('value')).toBe(newAccountPassword);

        const toAddress = element(by.id('toAddress'));
        const newToAddress = 'luke@tatooine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        const fromAddress = element(by.id('fromAddress'));
        const newFromAddress = 'han@falcon.space';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Save and check the update worked
        const saveButton = element(by.id('emailAlertSaveButton'));
        saveButton.click();
        dashboardItems.get(2).click();
        tabLinks.get(4).click();

        // Email Alerts config updated
        expect(element(by.id('alertsEnabled')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe(newAccountUsername);
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe(newAccountPassword);
        expect(element(by.id('toAddress')).getAttribute('value')).toBe(newToAddress);
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe(newFromAddress);
    });

    it('should NOT update Email Alerts fields after Cancel', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(4).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields
        const emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        const accountUsername = element(by.id('accountUsername'));
        const newAccountUsername = 'solo';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        const accountPassword = element(by.id('accountPassword'));
        const newAccountPassword = 'falcon123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        const retypeAccountPassword = element(by.id('retypeAccountPassword'));
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(newAccountPassword);
        expect(retypeAccountPassword.getAttribute('value')).toBe(newAccountPassword);

        const toAddress = element(by.id('toAddress'));
        const newToAddress = 'luke@tatooine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        const fromAddress = element(by.id('fromAddress'));
        const newFromAddress = 'han@falcon.space';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Cancel and check the update did not persist
        const cancelButton = element(by.id('emailAlertCancelButton'));
        cancelButton.click();
        dashboardItems.get(2).click();
        tabLinks.get(4).click();

        // Email Alerts config unchanged
        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');
    });

    it('should NOT save Email Alerts fields if there are validation errors', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(2).click();
        expect(element(by.css('h2')).getText()).toEqual('Gemini Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(4).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('c3po');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('ohMy');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('bb-8@jakku.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('c-3p0@naboo.space');

        // Update Email Alerts fields with some 'bad' values
        const emailAlertsEnabled = element(by.id('alertsEnabled'));
        emailAlertsEnabled.click();
        expect(emailAlertsEnabled.getAttribute('ng-reflect-model')).toBe('false'); // must be better way?

        const accountUsername = element(by.id('accountUsername'));
        const newAccountUsername = '@solo ~';
        accountUsername.clear();
        accountUsername.sendKeys(newAccountUsername);
        expect(accountUsername.getAttribute('value')).toBe(newAccountUsername);

        const accountPassword = element(by.id('accountPassword'));
        const newAccountPassword = '!falcon%123';
        accountPassword.clear();
        accountPassword.sendKeys(newAccountPassword);
        expect(accountPassword.getAttribute('value')).toBe(newAccountPassword);

        const retypeAccountPassword = element(by.id('retypeAccountPassword'));
        const confirmedPasswordValidButDifferent = 'confirmedPasswordValidButDifferent';
        retypeAccountPassword.clear();
        retypeAccountPassword.sendKeys(confirmedPasswordValidButDifferent);
        expect(retypeAccountPassword.getAttribute('value')).toBe(confirmedPasswordValidButDifferent);

        const toAddress = element(by.id('toAddress'));
        const newToAddress = '#luke@tatoo ine.space';
        toAddress.clear();
        toAddress.sendKeys(newToAddress);
        expect(toAddress.getAttribute('value')).toBe(newToAddress);

        const fromAddress = element(by.id('fromAddress'));
        const newFromAddress = 'han~falcon.space%';
        fromAddress.clear();
        fromAddress.sendKeys(newFromAddress);
        expect(fromAddress.getAttribute('value')).toBe(newFromAddress);

        // Save and check the update did not persist
        const saveButton = element(by.id('emailAlertSaveButton'));
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

        expect(element(by.id('fromAddress')).getAttribute('value')).toBe(newFromAddress);
        expect(element(by.id('invalidFromAddress')).getText()).toBe(
            'Valid email From Address is required, e.g. boba@hoth.com');
    });
});
