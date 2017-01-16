/******************************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing various scenarios using the app.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ****************************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Miscellaneous Scenario tests.
 *
 * TODO - Add some more scenarios...
 *
 * @author gazbert
 */
describe('Miscellaneous Scenario Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should add new Trading Strategy and be able to select it for existing Market', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

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

        // Save and update existing Market to use new strat
        let saveButton = element(by.id('strategySaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(1).click();

        // Existing Market fields
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('1: MACD RSI Indicator');

        // Update Market's Trading Strat
        let tradingStrategy = element(by.id('tradingStrategy_0'));
        let newTradingStrategy = '2: EMA Indicator';
        element(by.id('tradingStrategy_0')).sendKeys('EMA Indicator');
        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        saveButton = element(by.id('marketSaveButton'));
        saveButton.click();
        dashboardItems.get(3).click();
        tabLinks.get(1).click();

        // Market updated with new strat
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe(newTradingStrategy);
    });
});

//-----------------------------------------------------------------------------
// Stuff from previous BX-bot UI that I coded in Angular 1.x ...
//-----------------------------------------------------------------------------

// describe('*** BX-Bot UI App End-2-End Testing ***', function () {
//
//     browser.driver.manage().window().setSize(1200, 1000);
//
//     it('Should redirect index.html to index.html#/exchanges', function () {
//         browser.get('app/index.html');
//         browser.getLocationAbsUrl().then(function (url) {
//
//             expect(url).toEqual('/exchanges');     // use for custom REST Exchange service impl
//             //expect(url).toEqual('/exchanges/');  // use for $http service impl
//         });
//     });
//
//     describe('Exchange list view', function () {
//
//         beforeEach(function () {
//             browser.get('app/index.html#/exchanges');
//         });
//
//         it('Should filter the exchange list as a user types into the search box', function () {
//             3
//             var exchangeList = element.all(by.repeater('exchange in exchanges'));
//             var query = element(by.model('query'));
//
//             expect(exchangeList.count()).toBe(8);
//
//             query.sendKeys('coin');
//             expect(exchangeList.count()).toBe(5);
//
//             query.clear();
//             query.sendKeys('sta');
//             expect(exchangeList.count()).toBe(1);
//         });
//
//         it('Should be possible to control exchange order via the drop down select box', function () {
//
//             var exchangeNameColumn = element.all(by.repeater('exchange in exchanges').column('exchange.name'));
//             var query = element(by.model('query'));
//
//             function getNames() {
//                 return exchangeNameColumn.map(function (elm) {
//                     return elm.getText();
//                 });
//             }
//
//             query.sendKeys('coin'); // narrow the dataset to make the test assertions shorter
//
//             expect(getNames()).toEqual([
//                 "Bitstamp",
//                 "Coinbase",
//                 "BTC-e",
//                 "Huobi",
//                 "OKCoin"
//             ]);
//
//             element(by.model('orderProp')).element(by.css('option[value="name"]')).click();
//
//             expect(getNames()).toEqual([
//                 "Bitstamp",
//                 "BTC-e",
//                 "Coinbase",
//                 "Huobi",
//                 "OKCoin"
//             ]);
//         });
//
//         it('Should render exchange specific links', function () {
//             var query = element(by.model('query'));
//             query.sendKeys('huobi');
//             element.all(by.css('.exchanges li a')).first().click();
//             browser.getLocationAbsUrl().then(function (url) {
//                 expect(url).toEqual('/exchanges/Huobi');
//             });
//         });
//     });
//
//     describe('Exchange detail view', function () {
//
//         beforeEach(function () {
//             browser.get('app/index.html#/exchanges/Coinbase');
//         });
//
//         it('Should display Coinbase page', function () {
//             expect(element(by.binding('exchange.name')).getText()).toBe('Coinbase Configuration');
//         });
//
//         it('Should display expected Coinbase Market configuration', function () {
//
//             /*
//              * NOTE: For form input fields, you have to use by.model('exchange.market.counterCurrency') AND
//              * getAttribute('value') instead of getText() !
//              */
//             expect(element(by.model('exchange.market.label')).getAttribute('value')).toBe('BTC/GBP');
//             expect(element(by.model('exchange.market.id')).getAttribute('value')).toBe('BTC-GBP');
//             expect(element(by.model('exchange.market.baseCurrency')).getAttribute('value')).toBe('BTC');
//             expect(element(by.model('exchange.market.counterCurrency')).getAttribute('value')).toBe('GBP');
//
//             expect(element(by.binding('exchange.market.enabled')).getText()).toContain('\u2713'); // true/ticked
//         });
//
//     });
// });
