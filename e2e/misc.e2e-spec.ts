import {browser, element, by, protractor} from 'protractor';

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

    const WAIT_TIMEOUT = 20000;

    beforeEach(function () {
        browser.get('');
    });

    it('should add new Strategy and be able to select it for existing Market', function () {

        const searchBox = element.all(by.id('search-box'));
        searchBox.sendKeys('ItBit');

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));

        // https://stackoverflow.com/questions/28464604/more-than-one-element-found-for-locator-warning
        const EC = protractor.ExpectedConditions;
        const dashboard = element.all(by.css('app-bxbot-ui-dashboard-item')).first();
        browser.wait(EC.visibilityOf(dashboard), WAIT_TIMEOUT);

        expect(dashboardItems.count()).toBe(1);

        dashboardItems.get(0).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Bot Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        // Existing Strat 1
        expect(element(by.id('strategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('strategyDescription_0')).getAttribute('value')).toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('strategyClassname_0')).getAttribute('value')).toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Existing Strat 2
        expect(element(by.id('strategyName_1')).getAttribute('value')).toBe('MACD Indicator');
        expect(element(by.id('strategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator algo for deciding when to enter and exit trades.');
        expect(element(by.id('strategyClassname_1')).getAttribute('value')).toBe('com.gazbert.bxbot.strategies.MacdStrategy');

        // Add new Strat 3
        const addStrategyLink = element(by.id('addStrategyLink'));
        addStrategyLink.click();

        const strategyName = element(by.id('strategyName_2'));
        const newStrategyName = 'EMA Indicator';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        const strategyDescription = element(by.id('strategyDescription_2'));
        const newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        const strategyClassName = element(by.id('strategyClassname_2'));
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
        expect(element(by.id('strategy_0')).getAttribute('value')).toBe('1: MACD Indicator');

        // Update Market's Strat
        const strategy = element(by.id('strategy_0'));
        const newStrategy = '2: EMA Indicator';
        element(by.id('strategy_0')).sendKeys('EMA Indicator');
        expect(strategy.getAttribute('value')).toBe(newStrategy);

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
        expect(element(by.id('strategy_0')).getAttribute('value')).toBe(newStrategy);
    });
});
