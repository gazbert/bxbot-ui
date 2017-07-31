import {browser, element, by} from 'protractor';

/**
 * Miscellaneous Scenario tests.
 *
 * End 2 End Protractor tests (using Jasmine) for testing various scenarios using the app.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * TODO - Add more scenarios...
 *
 * @author gazbert
 */
describe('Miscellaneous Scenario Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should add new Trading Strategy and be able to select it for existing Market', function () {

        const searchBox = element.all(by.id('search-box'));
        searchBox.sendKeys('ItBit');

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        expect(dashboardItems.count()).toBe(1);

        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        // Existing Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Existing Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Add new Strat 3
        const addTradingStrategyLink = element(by.id('addTradingStrategyLink'));
        addTradingStrategyLink.click();

        const strategyName = element(by.id('tradingStrategyName_2'));
        const newStrategyName = 'EMA Indicator';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        const strategyDescription = element(by.id('tradingStrategyDescription_2'));
        const newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        const strategyClassName = element(by.id('tradingStrategyClassname_2'));
        const newStrategyClassName = 'com.gazbert.bxbot.strategies.EmaIndicator';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and update existing Market to use new strat
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Existing Market fields
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('XBT/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('XBT');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('1: MACD RSI Indicator');

        // Update Market's Trading Strat
        const tradingStrategy = element(by.id('tradingStrategy_0'));
        const newTradingStrategy = '2: EMA Indicator';
        element(by.id('tradingStrategy_0')).sendKeys('EMA Indicator');
        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        saveButton = element(by.id('marketSaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Market updated with new strat
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('XBT/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('XBT');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe(newTradingStrategy);
    });
});
