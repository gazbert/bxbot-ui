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
import {browser, element, by} from "protractor";
import {click} from "../testing/index";

/**
 * Market screen tests.
 *
 * TODO - Tests for add/remove markets
 * TODO - Tests for updating/validating fields
 */
describe('Market Screen Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render BTC-e Market config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
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
    });

    /**
     * TODO Test code seems very brittle - we need access to the model!
     */
    it('Should update Market fields after Save', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
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
        let marketEnabled = element(by.id('marketEnabled_0'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        // TODO - Cool! this has found a bug. If you update the id, it will create a new market, not update existing one.
        // FIX needed for Markets and Trading Strategies.
        // let marketId = element(by.id('marketId_0'));
        // marketId.clear();
        // marketId.sendKeys('myNewMarketId');
        // expect(marketId.getAttribute('value')).toBe('myNewMarketId');

        let marketName = element(by.id('marketName_0'));
        let newMarketName = 'myNewMarket';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        let baseCurrency = element(by.id('baseCurrency_0'));
        let newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        let counterCurrency = element(by.id('counterCurrency_0'));
        let newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        let tradingStrategy = element(by.id('tradingStrategy_0'));
        let newTradingStrategy = '1: Long Scalper';

        // TODO not supported with Angular 2 yet
        //element(by.model('tradingStrategy_0')).sendKeys('Long Scalper');

        // Both alts below work...
        element(by.id('tradingStrategy_0')).sendKeys('Long Scalper');
        //element(by.cssContainingText('option', 'Long Scalper')).click();

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        let saveButton = element(by.id('marketSaveButton'));
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

    /**
     * TODO Test code seems very brittle - we need access to the model!
     */
    it('Should NOT update Market fields after Cancel', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('0: MACD RSI Indicator');

        // Update market fields
        let marketEnabled = element(by.id('marketEnabled_0'));
        marketEnabled.click();
        expect(marketEnabled.getAttribute('ng-reflect-model')).toBe('true'); // must be better way?

        // TODO - Cool! this has found a bug. If you update the id, it will create a new market, not update existing one.
        // FIX needed for Markets and Trading Strategies.
        // let marketId = element(by.id('marketId_0'));
        // marketId.clear();
        // marketId.sendKeys('myNewMarketId');
        // expect(marketId.getAttribute('value')).toBe('myNewMarketId');

        let marketName = element(by.id('marketName_0'));
        let newMarketName = 'myNewMarket';
        marketName.clear();
        marketName.sendKeys(newMarketName);
        expect(marketName.getAttribute('value')).toBe(newMarketName);

        let baseCurrency = element(by.id('baseCurrency_0'));
        let newBaseCurrency = 'GBP';
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        let counterCurrency = element(by.id('counterCurrency_0'));
        let newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        let tradingStrategy = element(by.id('tradingStrategy_0'));
        let newTradingStrategy = '1: Long Scalper';

        // TODO not supported with Angular 2 yet
        //element(by.model('tradingStrategy_0')).sendKeys('Long Scalper');

        // Both alts below work...
        element(by.id('tradingStrategy_0')).sendKeys('Long Scalper');
        //element(by.cssContainingText('option', 'Long Scalper')).click();

        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Cancel and check the update did not persist
        let cancelButton = element(by.id('marketCancelButton'));
        cancelButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        // Market 1 unchanged
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
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
