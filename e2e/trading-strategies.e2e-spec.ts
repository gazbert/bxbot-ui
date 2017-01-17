/**********************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Trading Strategies screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 **********************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Trading Strategy screen tests.
 *
 * TODO - Test code seems very brittle: can we have access to the model please Angular :-)
 *
 * @author gazbert
 */
describe('Trading Strategy Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should update Trading Strategy fields after Save', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Update Strat 1 fields
        let strategyName = element(by.id('tradingStrategyName_0'));
        let newStrategyName = 'EMA Indicator 2';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        let strategyDescription = element(by.id('tradingStrategyDescription_0'));
        let newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        let strategyClassName = element(by.id('tradingStrategyClassname_0'));
        let newStrategyClassName = 'com.gazbert.bxbot.strategies2.EmaIndicator2';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and check the update worked
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Strat 1 updated
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe(newStrategyName);
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value')).toBe(newStrategyDescription);
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value')).toBe(newStrategyClassName);

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');
    });

    it('should NOT update Trading Strategy fields after Cancel', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Update Strat 1 fields
        let strategyName = element(by.id('tradingStrategyName_0'));
        let newStrategyName = 'EMA Indicator';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        let strategyDescription = element(by.id('tradingStrategyDescription_0'));
        let newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        let strategyClassName = element(by.id('tradingStrategyClassname_0'));
        let newStrategyClassName = 'com.gazbert.bxbot.strategies.EmaIndicator';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Cancel and check the update did not persist
        let cancelButton = element(by.id('strategyCancelButton'));
        cancelButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Strat 1 unchanged
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');
    });

    it('should add new Trading Strategy and save it', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Add new Strat 3
        let addTradingStrategyLink = element(by.id('addTradingStrategyLink'));
        addTradingStrategyLink.click();

        let strategyName = element(by.id('tradingStrategyName_2'));
        let newStrategyName = 'EMA Indicator';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        let strategyDescription = element(by.id('tradingStrategyDescription_2'));
        let newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        let strategyClassName = element(by.id('tradingStrategyClassname_2'));
        let newStrategyClassName = 'com.gazbert.bxbot.strategies.EmaIndicator';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and check the update worked
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Strat 1 unchanged
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value')).toBe(
            'Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value')).toBe(
            'com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Hello Strat 3!
        expect(element(by.id('tradingStrategyName_2')).getAttribute('value')).toBe(newStrategyName);
        expect(element(by.id('tradingStrategyDescription_2')).getAttribute('value')).toBe(newStrategyDescription);
        expect(element(by.id('tradingStrategyClassname_2')).getAttribute('value')).toBe(newStrategyClassName);
    });

    it('should delete Trading Strategy and save change', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Delete Strat 1
        let deleteTradingStrategyButton = element(by.id('deleteTradingStrategyButton_0'));
        deleteTradingStrategyButton.click();

        // Save and check the update worked
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(2).click();

        // Original Strat 1 'Long Scalper' deleted; new Strat 1 is 'MACD RSI Indicator' (previously Strat 2).
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value')).toBe(
            'MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value')).toBe(
            'com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Original Strat 2 moved
        expect(element(by.id('tradingStrategyName_1')).isPresent()).toBe(false);
        expect(element(by.id('tradingStrategyDescription_1')).isPresent()).toBe(false);
        expect(element(by.id('tradingStrategyClassname_1')).isPresent()).toBe(false);
    });

    it('should NOT delete Trading Strategy if currently being used by a Market', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Delete Strat 2 - will cause error
        let deleteTradingStrategyButton = element(by.id('deleteTradingStrategyButton_1'));
        deleteTradingStrategyButton.click();

        // Expect error modal to pop up to alert user
        expect(element(by.css('.modal-title')).getText()).toBe('Trading Strategy Still In Use');
        expect(element(by.css('.modal-body')).getText()).toContain(
            'You cannot delete this Trading Strategy because it is still being used my a Market on the Exchange.');

        let modalCloseButton = element(by.id('cannotDeleteStrategyModalCloseButton'));
        modalCloseButton.click();

        // Strat 1 unchanged
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');
    });


    it('should NOT save Trading Strategy fields if there are validation errors', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Strat 1
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');

        // Update Strat 1 fields with some 'bad' values
        let strategyName = element(by.id('tradingStrategyName_0'));
        strategyName.clear();
        let newStrategyName = 'dodgy n@me';
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        let strategyDescription = element(by.id('tradingStrategyDescription_0'));
        let newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        let strategyClassName = element(by.id('tradingStrategyClassname_0'));
        let newStrategyClassName = '123BadClassName';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and check the update did not persist
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();

        // Strat 1 - check for validation errors
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe(newStrategyName);
        expect(element(by.id('invalidTradingStrategyName_0')).getText()).toBe(
            'Strategy Name must be set. Value must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value')).toBe(newStrategyDescription);

        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value')).toBe(newStrategyClassName);
        expect(element(by.id('invalidTradingStrategyClassname_0')).getText()).toBe(
            'Strategy Class Name must be valid Java class, e.g. com.my.MyTradingStrategyClass');

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');
    });

});
