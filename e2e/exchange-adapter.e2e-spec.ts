/*********************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Exchange Adapter screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * @author gazbert
 *
 ********************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Exchange Adapter screen tests.
 *
 * TODO - Test code seems very brittle: can we have access to the model please Angular :-)
 *
 * @author gazbert
 */
describe('Exchange Adapter Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should update Exchange Adapter fields after Save', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields
        let adapterName = element(by.id('adapterName'));
        let newAdapterName = 'Bitstamp REST API v2 Adapter';
        adapterName.clear();
        adapterName.sendKeys(newAdapterName);
        expect(adapterName.getAttribute('value')).toBe(newAdapterName);

        let className = element(by.id('className'));
        let newClassName = 'my.new2.BitstampExchangeAdapterV2';
        className.clear();
        className.sendKeys(newClassName);
        expect(className.getAttribute('value')).toBe(newClassName);

        let connectionTimeout = element(by.id('connectionTimeout'));
        let newConnectionTimeout = '120';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        let errorCode_0 = element(by.id('errorCode_0'));
        let newErrorCode_0 = '525';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        let errorCode_1 = element(by.id('errorCode_1'));
        let newErrorCode_1 = '524';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        let errorMessage_0 = element(by.id('errorMessage_0'));
        let newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        let errorMessage_1 = element(by.id('errorMessage_1'));
        let newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Save and check the update worked
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('adapterName')).getAttribute('value')).toBe(newAdapterName);
        expect(element(by.id('className')).getAttribute('value')).toBe(newClassName);
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe(newConnectionTimeout);

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe(newErrorCode_0);
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe(newErrorCode_1);

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe(newErrorMessage_0);
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe(newErrorMessage_1);
    });

    it('should NOT update Exchange Adapter fields after Cancel', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields
        let adapterName = element(by.id('adapterName'));
        let newAdapterName = 'Bitstamp REST API v2 Adapter';
        adapterName.clear();
        adapterName.sendKeys(newAdapterName);
        expect(adapterName.getAttribute('value')).toBe(newAdapterName);

        let className = element(by.id('className'));
        let newClassName = 'my.new.BitstampExchangeAdapterV2';
        className.clear();
        className.sendKeys(newClassName);
        expect(className.getAttribute('value')).toBe(newClassName);

        let connectionTimeout = element(by.id('connectionTimeout'));
        let newConnectionTimeout = '120';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        let errorCode_0 = element(by.id('errorCode_0'));
        let newErrorCode_0 = '525';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        let errorCode_1 = element(by.id('errorCode_1'));
        let newErrorCode_1 = '524';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        let errorMessage_0 = element(by.id('errorMessage_0'));
        let newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        let errorMessage_1 = element(by.id('errorMessage_1'));
        let newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Cancel and check the update was not persisted
        let cancelButton = element(by.id('exchangeAdapterCancelButton'));
        cancelButton.click();
        dashboardItems.get(0).click();

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');
    });

    it('should add new Error Code and save it', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Add new Error Code
        let addErrorCodeLink = element(by.id('addNewErrorCodeLink'));
        addErrorCodeLink.click();

        let errorCode = element(by.id('errorCode_2'));
        let newErrorCode = '504';
        errorCode.clear();
        errorCode.sendKeys(newErrorCode);
        expect(errorCode.getAttribute('value')).toBe(newErrorCode);

        // Save and check the update worked
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Hello Error code 2!
        expect(element(by.id('errorCode_2')).getAttribute('value')).toBe('504');
    });

    it('should delete Error Code and save change', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Delete Error Code 1
        let deleteErrorCodeButton = element(by.id('deleteErrorCodeButton_0'));
        deleteErrorCodeButton.click();

        // Save and check the update worked
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        // Original Error Code 2 (522) moved
        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('522');
        expect(element(by.id('errorCode_1')).isPresent()).toBe(false); // 503 gone

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');
    });

    it('should add new Error Message and save it', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Add new Error Message
        let addErrorMessageLink = element(by.id('addNewErrorMessageLink'));
        addErrorMessageLink.click();

        let errorMessage = element(by.id('errorMessage_2'));
        let newErrorMessage = 'Connection reset by peer';
        errorMessage.clear();
        errorMessage.sendKeys(newErrorMessage);
        expect(errorMessage.getAttribute('value')).toBe(newErrorMessage);

        // Save and check the update worked
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Hello Error Message 2!
        expect(element(by.id('errorMessage_2')).getAttribute('value')).toBe('Connection reset by peer');
    });

    it('should delete Error Message and save change', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Delete Error Message 2
        let deleteErrorMessageButton = element(by.id('deleteErrorMessageButton_1'));
        deleteErrorMessageButton.click();

        // Save and check the update worked
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();
        dashboardItems.get(0).click();

        // Same as before
        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).isPresent()).toBe(false); // gone!
    });

    it('should NOT save Exchange Adapter fields if there are validation errors', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('Bitstamp Config Details');

        expect(element(by.id('adapterName')).getAttribute('value')).toBe('Bitstamp REST API Adapter');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('60');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');

        // Update fields with some 'bad' values
        let adapterName = element(by.id('adapterName'));
        let newAdapterName = 'Bitstamp REST API v2 Adapter!';
        adapterName.clear();
        adapterName.sendKeys(newAdapterName);
        expect(adapterName.getAttribute('value')).toBe(newAdapterName);

        let className = element(by.id('className'));
        let newClassName = 'my.1new.BitstampExchangeAdapterV2';
        className.clear();
        className.sendKeys(newClassName);
        expect(className.getAttribute('value')).toBe(newClassName);

        let connectionTimeout = element(by.id('connectionTimeout'));
        let newConnectionTimeout = 'ab1';
        connectionTimeout.clear();
        connectionTimeout.sendKeys(newConnectionTimeout);
        expect(connectionTimeout.getAttribute('value')).toBe(newConnectionTimeout);

        let errorCode_0 = element(by.id('errorCode_0'));
        let newErrorCode_0 = 'a25';
        errorCode_0.clear();
        errorCode_0.sendKeys(newErrorCode_0);
        expect(errorCode_0.getAttribute('value')).toBe(newErrorCode_0);

        let errorCode_1 = element(by.id('errorCode_1'));
        let newErrorCode_1 = '522';
        errorCode_1.clear();
        errorCode_1.sendKeys(newErrorCode_1);
        expect(errorCode_1.getAttribute('value')).toBe(newErrorCode_1);

        let errorMessage_0 = element(by.id('errorMessage_0'));
        let newErrorMessage_0 = 'Connection reset by peer';
        errorMessage_0.clear();
        errorMessage_0.sendKeys(newErrorMessage_0);
        expect(errorMessage_0.getAttribute('value')).toBe(newErrorMessage_0);

        let errorMessage_1 = element(by.id('errorMessage_1'));
        let newErrorMessage_1 = 'Remote host closed connection during handshake';
        errorMessage_1.clear();
        errorMessage_1.sendKeys(newErrorMessage_1);
        expect(errorMessage_1.getAttribute('value')).toBe(newErrorMessage_1);

        // Save and check the update did not persist
        let saveButton = element(by.id('exchangeAdapterSaveButton'));
        saveButton.click();

        // Check for validation errors
        expect(element(by.id('adapterName')).getAttribute('value')).toBe(newAdapterName);
        expect(element(by.id('invalidAdapterName')).getText()).toBe(
            'Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('className')).getAttribute('value')).toBe(newClassName);
        expect(element(by.id('invalidClassName')).getText()).toBe(
            'Class Name must be valid Java class, e.g. com.my.MyExchangeAdapterClass');

        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe(newConnectionTimeout);
        expect(element(by.id('invalidConnectionTimeout')).getText()).toBe(
            'Connection timeout must be a whole number.');

        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe(newErrorCode_0);
        expect(element(by.id('invalidErrorCode_0')).getText()).toContain(
            'HTTP Status Code must be a 3 digit number.');

        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe(newErrorCode_1);

        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe(newErrorMessage_0);
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe(newErrorMessage_1);
    });

});
