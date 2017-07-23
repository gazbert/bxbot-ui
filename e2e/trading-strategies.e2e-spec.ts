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
import {browser, element, by} from 'protractor';

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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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
        const strategyName = element(by.id('tradingStrategyName_0'));
        const newStrategyName = 'EMA Indicator 2';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        const strategyDescription = element(by.id('tradingStrategyDescription_0'));
        const newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        const strategyClassName = element(by.id('tradingStrategyClassname_0'));
        const newStrategyClassName = 'com.gazbert.bxbot.strategies2.EmaIndicator2';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and check the update worked
        const saveButton = element(by.id('strategySaveButton'));
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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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
        const strategyName = element(by.id('tradingStrategyName_0'));
        const newStrategyName = 'EMA Indicator';
        strategyName.clear();
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        const strategyDescription = element(by.id('tradingStrategyDescription_0'));
        const newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        const strategyClassName = element(by.id('tradingStrategyClassname_0'));
        const newStrategyClassName = 'com.gazbert.bxbot.strategies.EmaIndicator';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Cancel and check the update did not persist
        const cancelButton = element(by.id('strategyCancelButton'));
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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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

        // Save and check the update worked
        const saveButton = element(by.id('strategySaveButton'));
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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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
        const deleteTradingStrategyButton = element(by.id('deleteTradingStrategyButton_0'));
        deleteTradingStrategyButton.click();

        // Save and check the update worked
        const saveButton = element(by.id('strategySaveButton'));
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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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
        const deleteTradingStrategyButton = element(by.id('deleteTradingStrategyButton_1'));
        deleteTradingStrategyButton.click();

        // Expect error modal to pop up to alert user
        expect(element(by.css('.modal-title')).getText()).toBe('Trading Strategy Still In Use');
        expect(element(by.css('.modal-body')).getText()).toContain(
            'You cannot delete this Trading Strategy because it is still being used by a Market on the Exchange.');

        const modalCloseButton = element(by.id('cannotDeleteStrategyModalCloseButton'));
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

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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
        const strategyName = element(by.id('tradingStrategyName_0'));
        strategyName.clear();
        const newStrategyName = 'dodgy n@me';
        strategyName.sendKeys(newStrategyName);
        expect(strategyName.getAttribute('value')).toBe(newStrategyName);

        const strategyDescription = element(by.id('tradingStrategyDescription_0'));
        const newStrategyDescription = 'EMA Indicator algo for deciding when to enter and exit trades.';
        strategyDescription.clear();
        strategyDescription.sendKeys(newStrategyDescription);
        expect(strategyDescription.getAttribute('value')).toBe(newStrategyDescription);

        const strategyClassName = element(by.id('tradingStrategyClassname_0'));
        const newStrategyClassName = '123BadClassName';
        strategyClassName.clear();
        strategyClassName.sendKeys(newStrategyClassName);
        expect(strategyClassName.getAttribute('value')).toBe(newStrategyClassName);

        // Save and check the update did not persist
        const saveButton = element(by.id('strategySaveButton'));
        saveButton.click();

        // Strat 1 - check for validation errors
        expect(element(by.id('tradingStrategyName_0')).getAttribute('value')).toBe(newStrategyName);
        expect(element(by.id('invalidTradingStrategyName_0')).getText()).toBe(
            'Name must be alphanumeric and can only include the following special characters: _ -');

        expect(element(by.id('tradingStrategyDescription_0')).getAttribute('value')).toBe(newStrategyDescription);

        expect(element(by.id('tradingStrategyClassname_0')).getAttribute('value')).toBe(newStrategyClassName);
        expect(element(by.id('invalidTradingStrategyClassname_0')).getText()).toBe(
            'Class Name must be valid Java class, e.g. com.my.MyTradingStrategyClass');

        // Strat 2 unchanged
        expect(element(by.id('tradingStrategyName_1')).getAttribute('value')).toBe('MACD RSI Indicator');
        expect(element(by.id('tradingStrategyDescription_1')).getAttribute('value'))
            .toBe('MACD Indicator and RSI algo for deciding when to enter and exit trades.');
        expect(element(by.id('tradingStrategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.MacdRsiStrategy');
    });

    it('should NOT save new Trading Strategy when Strategy Name already in use', function () {

        const dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Details');

        const tabLinks = element.all(by.css('li'));
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

        // Add new Strat 3 with same name as Strat 2
        const addTradingStrategyLink = element(by.id('addTradingStrategyLink'));
        addTradingStrategyLink.click();

        const strategyName = element(by.id('tradingStrategyName_2'));
        const newStrategyName = 'MACD RSI Indicator'; // eek!
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

        // Save and check the update failed
        const saveButton = element(by.id('strategySaveButton'));
        saveButton.click();

        // Strat 3 - check for validation errors
        expect(element(by.id('tradingStrategyName_2')).getAttribute('value')).toBe(newStrategyName);
        expect(element(by.id('invalidTradingStrategyName_2')).getText()).toBe(
            'Strategy Name already in use on this Exchange. Please choose another.');

        expect(element(by.id('tradingStrategyDescription_2')).getAttribute('value')).toBe(newStrategyDescription);
        expect(element(by.id('tradingStrategyClassname_2')).getAttribute('value')).toBe(newStrategyClassName);

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
    });
});
