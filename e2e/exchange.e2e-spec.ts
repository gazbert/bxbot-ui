import {browser, by, element, protractor} from 'protractor';

/**
 * Exchange screen tests.
 *
 * End 2 End Protractor tests (using Jasmine) for testing Exchange screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * @author gazbert
 */
describe('Exchange Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should update Exchange fields after Save', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields
        const exchangeName = element(by.id('exchangeName'));
        const newExchangeName = 'Bitstamp 2';
        exchangeName.clear();
        exchangeName.sendKeys(newExchangeName);
        expect(exchangeName.getAttribute('value')).toBe(newExchangeName);

        const adapterClass = element(by.id('adapterClass'));
        const newClassName = 'my.new2.BitstampExchangeAdapterV2';
        adapterClass.clear();
        adapterClass.sendKeys(newClassName);
        expect(adapterClass.getAttribute('value')).toBe(newClassName);

        const connectionTimeout = element(by.id('connectionTimeout'));
        const newConnectionTimeout = '120';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        const errorCode_0 = element(by.id('errorCode_0'));
        const newErrorCode_0 = '525';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        const errorCode_1 = element(by.id('errorCode_1'));
        const newErrorCode_1 = '524';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        const errorMessage_0 = element(by.id('errorMessage_0'));
        const newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        const errorMessage_1 = element(by.id('errorMessage_1'));
        const newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe(newExchangeName);
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe(newClassName);
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe(newConnectionTimeout);

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe(newErrorCode_0);
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe(newErrorCode_1);

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe(newErrorMessage_0);
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe(newErrorMessage_1);
    });

    it('should NOT update Exchange fields after Cancel', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields
        const exchangeName = element(by.id('exchangeName'));
        const newExchangeName = 'Bitstamp 2';
        exchangeName.clear();
        exchangeName.sendKeys(newExchangeName);
        expect(exchangeName.getAttribute('value')).toBe(newExchangeName);

        const adapterClass = element(by.id('adapterClass'));
        const newClassName = 'my.new.BitstampExchangeAdapterV2';
        adapterClass.clear();
        adapterClass.sendKeys(newClassName);
        expect(adapterClass.getAttribute('value')).toBe(newClassName);

        const connectionTimeout = element(by.id('connectionTimeout'));
        const newConnectionTimeout = '120';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        const errorCode_0 = element(by.id('errorCode_0'));
        const newErrorCode_0 = '525';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        const errorCode_1 = element(by.id('errorCode_1'));
        const newErrorCode_1 = '524';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        const errorMessage_0 = element(by.id('errorMessage_0'));
        const newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        const errorMessage_1 = element(by.id('errorMessage_1'));
        const newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Cancel and check the update was not persisted
        const cancelButton = element(by.id('exchangeCancelButton'));
        cancelButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');
    });

    it('should add new Error Code and save it', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Add new Error Code
        const addErrorCodeLink = element(by.id('addNewErrorCodeLink'));
        addErrorCodeLink.click();

        const errorCode = element(by.id('errorCode_2'));
        const newErrorCode = '504';
        errorCode.clear();
        errorCode.sendKeys(newErrorCode);
        expect(errorCode.getAttribute('value')).toBe(newErrorCode);

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Hello Error code 2!
        expect(element(by.id('errorCode_2')).getAttribute('value')).toBe('504');
    });

    it('should delete Error Code and save change', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Delete Error Code 1
        const deleteErrorCodeButton = element(by.id('deleteErrorCodeButton_0'));
        deleteErrorCodeButton.click();

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        // Original Error Code 2 (522) moved
        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('522');
        expect(element(by.id('errorCode_1')).isPresent()).toBe(false); // 503 gone

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');
    });

    it('should add new Error Message and save it', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Add new Error Message
        const addErrorMessageLink = element(by.id('addNewErrorMessageLink'));
        addErrorMessageLink.click();

        const errorMessage = element(by.id('errorMessage_2'));
        const newErrorMessage = 'Connection reset by peer';
        errorMessage.clear();
        errorMessage.sendKeys(newErrorMessage);
        expect(errorMessage.getAttribute('value')).toBe(newErrorMessage);

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Hello Error Message 2!
        expect(element(by.id('errorMessage_2')).getAttribute('value')).toBe('Connection reset by peer');
    });

    it('should delete Error Message and save change', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Delete Error Message 2
        const deleteErrorMessageButton = element(by.id('deleteErrorMessageButton_1'));
        deleteErrorMessageButton.click();

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).isPresent()).toBe(false); // gone!
    });

    it('should add new Optional Config Item and save it', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Add new Config Item
        const optionalExchangeConfigButton = element(by.id('optionalExchangeConfigButton'));
        optionalExchangeConfigButton.click();

        // Need to wait for link to become visible...
        const EC = protractor.ExpectedConditions;
        const addConfigItemLink = element(by.id('addNewExchangeConfigItemLink'));
        browser.wait(EC.visibilityOf(addConfigItemLink), 1000);
        addConfigItemLink.click();

        // Wait for new item to panel to become visible...
        const exchangeConfigItemName = element(by.id('exchangeConfigItemName_0'));
        browser.wait(EC.visibilityOf(exchangeConfigItemName), 1000);

        const newConfigItemName = 'buy-fee';
        exchangeConfigItemName.clear();
        exchangeConfigItemName.sendKeys(newConfigItemName);
        expect(exchangeConfigItemName.getAttribute('value')).toBe(newConfigItemName);

        const exchangeConfigItemValue = element(by.id('exchangeConfigItemValue_0'));
        const newConfigItemValue = '0.25';
        exchangeConfigItemValue.clear();
        exchangeConfigItemValue.sendKeys(newConfigItemValue);
        expect(exchangeConfigItemValue.getAttribute('value')).toBe(newConfigItemValue);

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Hello new Config Item!
        expect(element(by.id('exchangeConfigItemName_0')).getAttribute('value')).toBe('buy-fee');
        expect(element(by.id('exchangeConfigItemValue_0')).getAttribute('value')).toBe('0.25');
    });

    it('should delete Optional Config Item and save change', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        const EC = protractor.ExpectedConditions;
        const dashboard = element(by.css('app-bxbot-ui-dashboard-item'));
        browser.wait(EC.visibilityOf(dashboard), 3000);

        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('GDAX');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('120');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        const optionalExchangeConfigButton = element(by.id('optionalExchangeConfigButton'));
        optionalExchangeConfigButton.click();

        // Delete Config Item 2
        // Need to wait for link + config items to become visible...
        const deleteConfigItemButton = element(by.id('deleteExchangeConfigItemButton_1'));
        browser.wait(EC.visibilityOf(deleteConfigItemButton), 3000);

        expect(element(by.id('exchangeConfigItemName_0')).getAttribute('value')).toBe('buy-fee');
        expect(element(by.id('exchangeConfigItemValue_0')).getAttribute('value')).toBe('0.25');

        expect(element(by.id('exchangeConfigItemName_1')).getAttribute('value')).toBe('sell-fee');
        expect(element(by.id('exchangeConfigItemValue_1')).getAttribute('value')).toBe('0.25');

        deleteConfigItemButton.click();

        // Save and check the update worked
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();
        dashboardItems.get(1).click();

        // Same as before
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('GDAX');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('120');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('exchangeConfigItemName_0')).getAttribute('value')).toBe('buy-fee');
        expect(element(by.id('exchangeConfigItemValue_0')).getAttribute('value')).toBe('0.25');
        expect(element(by.id('exchangeConfigItemName_1')).isPresent()).toBe(false); // gone!
        expect(element(by.id('exchangeConfigItemValue_1')).isPresent()).toBe(false); // gone!
    });

    it('should NOT save Exchange fields if there are validation errors', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('Bitstamp');
        expect(element(by.id('adapterClass')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields with some 'bad' values
        const exchangeName = element(by.id('exchangeName'));
        const newExchangeName = 'Bitstamp!';
        exchangeName.clear();
        exchangeName.sendKeys(newExchangeName);
        expect(exchangeName.getAttribute('value')).toBe(newExchangeName);

        const adapterClass = element(by.id('adapterClass'));
        const newClassName = 'my.1new.BitstampExchangeAdapterV2';
        adapterClass.clear();
        adapterClass.sendKeys(newClassName);
        expect(adapterClass.getAttribute('value')).toBe(newClassName);

        const connectionTimeout = element(by.id('connectionTimeout'));
        const newConnectionTimeout = 'ab1';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        const errorCode_0 = element(by.id('errorCode_0'));
        const newErrorCode_0 = 'a25';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        const errorCode_1 = element(by.id('errorCode_1'));
        const newErrorCode_1 = '522';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        const errorMessage_0 = element(by.id('errorMessage_0'));
        const newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        const errorMessage_1 = element(by.id('errorMessage_1'));
        const newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Add new Config Item
        const optionalExchangeConfigButton = element(by.id('optionalExchangeConfigButton'));
        optionalExchangeConfigButton.click();

        // Need to wait for link to become visible...
        const EC = protractor.ExpectedConditions;
        const addConfigItemLink = element(by.id('addNewExchangeConfigItemLink'));
        browser.wait(EC.visibilityOf(addConfigItemLink), 3000);
        addConfigItemLink.click();

        // Wait for new item to panel to become visible...
        const exchangeConfigItemName = element(by.id('exchangeConfigItemName_0'));
        browser.wait(EC.visibilityOf(exchangeConfigItemName), 3000);

        const newConfigItemName = 'buy-fee!';
        exchangeConfigItemName.clear();
        exchangeConfigItemName.sendKeys(newConfigItemName);
        expect(exchangeConfigItemName.getAttribute('value')).toBe(newConfigItemName);

        const exchangeConfigItemValue = element(by.id('exchangeConfigItemValue_0'));
        const newConfigItemValue = '';
        exchangeConfigItemValue.clear();
        exchangeConfigItemValue.sendKeys(newConfigItemValue);
        expect(exchangeConfigItemValue.getAttribute('value')).toBe(newConfigItemValue);

        // Save and check the update did not persist
        const saveButton = element(by.id('exchangeSaveButton'));
        saveButton.click();

        // Check for validation errors
        expect(element(by.id('exchangeName')).getAttribute('value')).toBe(newExchangeName);
        expect(element(by.id('invalidExchangeName')).getText()).toBe(
            'Exchange Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('adapterClass')).getAttribute('value')).toBe(newClassName);
        expect(element(by.id('invalidAdapterClass')).getText()).toBe(
            'Adapter Class name must be valid Java class, e.g. com.my.MyExchangeAdapterClass');

        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe(newConnectionTimeout);
        expect(element(by.id('invalidConnectionTimeout')).getText()).toBe(
            'Connection timeout must be a whole number.');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe(newErrorCode_0);
        expect(element(by.id('invalidErrorCode_0')).getText()).toContain(
            'HTTP Status Code must be a 3 digit number.');

        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe(newErrorCode_1);

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe(newErrorMessage_0);
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe(newErrorMessage_1);

        expect(element(by.id('exchangeConfigItemName_0')).getAttribute('value')).toBe('buy-fee!');
        expect(element(by.id('invalidExchangeConfigItemName_0')).getText()).toContain(
            'Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('exchangeConfigItemValue_0')).getAttribute('value')).toBe('');
        expect(element(by.id('invalidExchangeConfigItemValue_0')).getText()).toContain('Value is required');
    });
});
