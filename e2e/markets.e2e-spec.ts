/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Markets screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ******************************************************************************/
import {browser, element, by} from 'protractor';

/**
 * Market screen tests.
 *
 * TODO - Test code seems very brittle: can we have access to the model please Angular :-)
 *
 * @author gazbert
 */
describe('Market Screen Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should update Market fields after Save', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');

        // Update market fields
        const marketEnabled = element(by.id('marketEnabled_0'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        const marketName = element(by.id('marketName_0'));
        const newMarketName = 'GBP/ETH';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        const baseCurrency = element(by.id('baseCurrency_0'));
        const newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        const counterCurrency = element(by.id('counterCurrency_0'));
        const newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        const tradingStrategy = element(by.id('tradingStrategy_0'));
        const newTradingStrategy = '1: Long Scalper';

        // TODO not supported with Angular 2 yet
        // element(by.model('tradingStrategy_0')).sendKeys('Long Scalper');

        // Both alts below work...
        element(by.id('tradingStrategy_0')).sendKeys('Long Scalper');
        // element(by.cssContainingText('option', 'Long Scalper')).click();

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        const saveButton = element(by.id('marketSaveButton'));
        saveButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        // Market 1 updated
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe(newMarketName);
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe(newBaseCurrency);
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe(newCounterCurrency);
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe(newTradingStrategy);

        // Market 2 unchanged
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');
    });

    it('should NOT update Market fields after Cancel', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Update market fields
        const marketEnabled = element(by.id('marketEnabled_0'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        const marketName = element(by.id('marketName_0'));
        const newMarketName = 'GBP/ETH';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        const baseCurrency = element(by.id('baseCurrency_0'));
        const newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        const counterCurrency = element(by.id('counterCurrency_0'));
        const newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        const tradingStrategy = element(by.id('tradingStrategy_0'));
        const newTradingStrategy = '1: Long Scalper';

        // TODO not supported with Angular 2 yet
        // element(by.model('tradingStrategy_0')).sendKeys('Long Scalper');

        // Both alts below work...
        element(by.id('tradingStrategy_0')).sendKeys('Long Scalper');
        // element(by.cssContainingText('option', 'Long Scalper')).click();

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Cancel and check the update did not persist
        const cancelButton = element(by.id('marketCancelButton'));
        cancelButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        // Market 1 unchanged
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2 unchanged
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');
    });

    it('should add new Market and save it', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');

        // Add new Market 3
        const addMarketLink = element(by.id('addMarketLink'));
        addMarketLink.click();

        const marketEnabled = element(by.id('marketEnabled_2'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        const marketName = element(by.id('marketName_2'));
        const newMarketName = 'GBP/BTC';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        const baseCurrency = element(by.id('baseCurrency_2'));
        const newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        const counterCurrency = element(by.id('counterCurrency_2'));
        const newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        const tradingStrategy = element(by.id('tradingStrategy_2'));
        const newTradingStrategy = '1: Long Scalper';

        // TODO not supported with Angular 2 yet
        // element(by.model('tradingStrategy_0')).sendKeys('Long Scalper');

        // Both alts below work...
        element(by.id('tradingStrategy_2')).sendKeys('Long Scalper');
        // element(by.cssContainingText('option', 'Long Scalper')).click();

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        const saveButton = element(by.id('marketSaveButton'));
        saveButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        // Market 1 unchanged
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2 unchanged
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');

        // Hello Market 3!
        expect(element(by.id('marketEnabled_2')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_2')).getAttribute('value')).toBe(newMarketName);
        expect(element(by.id('baseCurrency_2')).getAttribute('value')).toBe(newBaseCurrency);
        expect(element(by.id('counterCurrency_2')).getAttribute('value')).toBe(newCounterCurrency);
        expect(element(by.id('tradingStrategy_2')).getAttribute('value')).toBe('1: Long Scalper');
    });

    it('should delete Market and save change', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');

        // Delete Market 1
        const deleteMarketButton = element(by.id('deleteMarketButton_0'));
        deleteMarketButton.click();

        // Save and check the update worked
        const saveButton = element(by.id('marketSaveButton'));
        saveButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        // Original Market 1 'BTC/USD' deleted; new Market 1 is 'LTC/USD' (previously Market 2).
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('1: Long Scalper');

        // Original Market 2 moved
        expect(element(by.id('marketEnabled_1')).isPresent()).toBe(false);
        expect(element(by.id('marketName_1')).isPresent()).toBe(false);
        expect(element(by.id('baseCurrency_1')).isPresent()).toBe(false);
        expect(element(by.id('counterCurrency_1')).isPresent()).toBe(false);
        expect(element(by.id('tradingStrategy_1')).isPresent()).toBe(false);
    });

    it('should NOT save Market fields if there are validation errors', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Update Market 1 fields with some 'bad' values
        const marketEnabled = element(by.id('marketEnabled_0'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        const marketName = element(by.id('marketName_0'));
        const newMarketName = 'GBP # ETH';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        const baseCurrency = element(by.id('baseCurrency_0'));
        const newBaseCurrency = 'GB2';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        const counterCurrency = element(by.id('counterCurrency_0'));
        const newCounterCurrency = 'E T';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        const tradingStrategy = element(by.id('tradingStrategy_0'));
        const newTradingStrategy = '1: Long Scalper';
        element(by.id('tradingStrategy_0')).sendKeys('Long Scalper');
        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update did not persist
        const saveButton = element(by.id('marketSaveButton'));
        saveButton.click();

        // Market 1 - check for validation errors
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('true');

        expect(element(by.id('marketName_0')).getAttribute('value')).toBe(newMarketName);
        expect(element(by.id('invalidMarketName_0')).getText()).toBe(
            'Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe(newBaseCurrency);
        expect(element(by.id('invalidBaseCurrency_0')).getText()).toBe(
            'Base Currency must be valid 3 character currency id, e.g. USD');

        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe(newCounterCurrency);
        expect(element(by.id('invalidCounterCurrency_0')).getText()).toBe(
            'Counter Currency must be valid 3 character currency id, e.g. BTC');

        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe(newTradingStrategy);

        // Market 2 unchanged
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');
    });

    it('should NOT save new Market when Market Name already in use', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');

        // Add new Market 3 with existing Market 2 name
        const addMarketLink = element(by.id('addMarketLink'));
        addMarketLink.click();

        const marketEnabled = element(by.id('marketEnabled_2'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        const marketName = element(by.id('marketName_2'));
        const newMarketName = 'LTC/USD'; // already in use
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        const baseCurrency = element(by.id('baseCurrency_2'));
        const newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        const counterCurrency = element(by.id('counterCurrency_2'));
        const newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        const tradingStrategy = element(by.id('tradingStrategy_2'));
        const newTradingStrategy = '1: Long Scalper';
        element(by.id('tradingStrategy_2')).sendKeys('Long Scalper');

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update failed
        const saveButton = element(by.id('marketSaveButton'));
        saveButton.click();

        // Market 3 - check for validation errors
        expect(element(by.id('marketEnabled_2')).getAttribute('ng-reflect-model')).toBe('true');

        expect(element(by.id('marketName_2')).getAttribute('value')).toBe(newMarketName);
        expect(element(by.id('invalidMarketName_2')).getText()).toBe(
            'Market Name already in use on this Exchange. Please choose another.');

        expect(element(by.id('baseCurrency_2')).getAttribute('value')).toBe(newBaseCurrency);
        expect(element(by.id('counterCurrency_2')).getAttribute('value')).toBe(newCounterCurrency);
        expect(element(by.id('tradingStrategy_2')).getAttribute('value')).toBe(newTradingStrategy);

        // Market 1 unchanged
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Market 2 unchanged
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('LTC/USD');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('LTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_1')).getAttribute('value')).toBe('1: Long Scalper');
    });
});
