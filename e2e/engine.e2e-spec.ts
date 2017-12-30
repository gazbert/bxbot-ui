import {browser, element, by, protractor} from 'protractor';

/**
 * Engine screen tests.
 *
 * End 2 End Protractor tests (using Jasmine) for testing Engine screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * @author gazbert
 */
describe('Engine Tests', function () {

    const WAIT_TIMEOUT = 20000;

    beforeEach(function () {
        browser.get('');
    });

    it('should update Engine fields after Save', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        // https://stackoverflow.com/questions/28464604/more-than-one-element-found-for-locator-warning
        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(0).click();

        expect(element(by.id('botId')).getAttribute('value')).toBe('bitstamp-1');
        expect(element(by.id('botName')).getAttribute('value')).toBe('Bitstamp Bot');
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe('30');
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe('0.5');

        // Update fields
        const botName = element(by.id('botName'));
        const newBotName = 'Bitstamp V2';
        botName.clear();
        botName.sendKeys(newBotName);
        expect(botName.getAttribute('value')).toBe(newBotName);

        const tradeCycleInterval = element(by.id('tradeCycleInterval'));
        const newTradingCycleInterval = '10';
        tradeCycleInterval.clear();
        tradeCycleInterval.sendKeys(newTradingCycleInterval);
        expect(tradeCycleInterval.getAttribute('value')).toBe(newTradingCycleInterval);

        const emergencyStopCurrency = element(by.id('emergencyStopCurrency'));
        const newEmergencyStopCurrency = 'USD';
        emergencyStopCurrency.clear();
        emergencyStopCurrency.sendKeys(newEmergencyStopCurrency);
        expect(emergencyStopCurrency.getAttribute('value')).toBe(newEmergencyStopCurrency);

        const emergencyStopBalance = element(by.id('emergencyStopBalance'));
        const newEmergencyStopBalance = '0.7';
        emergencyStopBalance.clear();
        emergencyStopBalance.sendKeys(newEmergencyStopBalance);
        expect(emergencyStopBalance.getAttribute('value')).toBe(newEmergencyStopBalance);

        // Save and check the update worked
        const saveButton = element(by.id('engineSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('botName')).getAttribute('value')).toBe(newBotName);
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe(newTradingCycleInterval);
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe(newEmergencyStopCurrency);
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe(newEmergencyStopBalance);
    });

    it('should NOT update Engine fields after Cancel', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(0).click();

        expect(element(by.id('botId')).getAttribute('value')).toBe('bitstamp-1');
        expect(element(by.id('botName')).getAttribute('value')).toBe('Bitstamp Bot');
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe('30');
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe('0.5');

        // Update fields
        const botName = element(by.id('botName'));
        const newBotName = 'Bitstamp V2';
        botName.clear();
        botName.sendKeys(newBotName);
        expect(botName.getAttribute('value')).toBe(newBotName);

        const tradeCycleInterval = element(by.id('tradeCycleInterval'));
        const newTradingCycleInterval = '10';
        tradeCycleInterval.clear();
        tradeCycleInterval.sendKeys(newTradingCycleInterval);
        expect(tradeCycleInterval.getAttribute('value')).toBe(newTradingCycleInterval);

        const emergencyStopCurrency = element(by.id('emergencyStopCurrency'));
        const newEmergencyStopCurrency = 'USD';
        emergencyStopCurrency.clear();
        emergencyStopCurrency.sendKeys(newEmergencyStopCurrency);
        expect(emergencyStopCurrency.getAttribute('value')).toBe(newEmergencyStopCurrency);

        const emergencyStopBalance = element(by.id('emergencyStopBalance'));
        const newEmergencyStopBalance = '0.7';
        emergencyStopBalance.clear();
        emergencyStopBalance.sendKeys(newEmergencyStopBalance);
        expect(emergencyStopBalance.getAttribute('value')).toBe(newEmergencyStopBalance);

        // Cancel and check the update was not persisted
        const cancelButton = element(by.id('engineCancelButton'));
        cancelButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('botId')).getAttribute('value')).toBe('bitstamp-1');
        expect(element(by.id('botName')).getAttribute('value')).toBe('Bitstamp Bot');
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe('30');
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe('0.5');
    });

    it('should NOT save Engine fields if there are validation errors', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(0).click();

        expect(element(by.id('botId')).getAttribute('value')).toBe('bitstamp-1');
        expect(element(by.id('botName')).getAttribute('value')).toBe('Bitstamp Bot');
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe('30');
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe('0.5');

        // Update fields with some 'bad' values
        const botName = element(by.id('botName'));
        const newBotName = 'Bitstamp V3!';
        botName.clear();
        botName.sendKeys(newBotName);
        expect(botName.getAttribute('value')).toBe(newBotName);

        const tradeCycleInterval = element(by.id('tradeCycleInterval'));
        const newTradingCycleInterval = 'a10';
        tradeCycleInterval.clear();
        tradeCycleInterval.sendKeys(newTradingCycleInterval);
        expect(tradeCycleInterval.getAttribute('value')).toBe(newTradingCycleInterval);

        const emergencyStopCurrency = element(by.id('emergencyStopCurrency'));
        const newEmergencyStopCurrency = 'US_';
        emergencyStopCurrency.clear();
        emergencyStopCurrency.sendKeys(newEmergencyStopCurrency);
        expect(emergencyStopCurrency.getAttribute('value')).toBe(newEmergencyStopCurrency);

        const emergencyStopBalance = element(by.id('emergencyStopBalance'));
        const newEmergencyStopBalance = '0.k7';
        emergencyStopBalance.clear();
        emergencyStopBalance.sendKeys(newEmergencyStopBalance);
        expect(emergencyStopBalance.getAttribute('value')).toBe(newEmergencyStopBalance);

        // Save and check the update did not persist
        const saveButton = element(by.id('engineSaveButton'));
        saveButton.click();

        // Check for validation errors
        expect(element(by.id('botId')).getAttribute('value')).toBe('bitstamp-1');

        expect(element(by.id('botName')).getAttribute('value')).toBe(newBotName);
        expect(element(by.id('invalidBotName')).getText()).toBe(
            'Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe(newTradingCycleInterval);
        expect(element(by.id('invalidTradeCycleInterval')).getText()).toBe(
            'Trade Cycle Interval must be a whole number.');

        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe(newEmergencyStopCurrency);
        expect(element(by.id('invalidEmergencyStopCurrency')).getText()).toBe(
            'Emergency Stop Currency must be valid 3 character currency id, e.g. BTC');

        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe(newEmergencyStopBalance);
        expect(element(by.id('invalidEmergencyStopBalance')).getText()).toBe(
            'Emergency Stop Balance must be a decimal number.');
    });

});
