/******************************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing various scenarios using the App.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * TODO - write tests for scenarios like:
 *
 * 1. Goto Dashboard, Click on GDAX, Update Market, Save, Update Email Alerts, Save, Goto Dashboard,
 *    click on GDAX, check Market and Email Alerts updates are persisted.
 * 2. etc...
 ****************************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Market screen tests.
 *
 * TODO - Tests for add/remove markets
 * TODO - Tests for updating/validating fields
 * TODO - Tests for save and cancel
 */
xdescribe('Market Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render BTC-e Market config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
        expect(element(by.id('marketId_0')).getAttribute('value')).toBe('btce_btc_usd');
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('btce_macd_rsi');
    });

    /**
     * TODO Test code seems very brittle - we need access to the model!!!
     */
    it('Should update Market fields after saving', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(4).click();
        expect(element(by.css('h2')).getText()).toEqual('BTC-e Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe(null);
        expect(element(by.id('marketId_0')).getAttribute('value')).toBe('btce_btc_usd');
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('tradingStrategy_0')).getAttribute('value')).toBe('btce_macd_rsi');

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
        let newBaseCurrency = 'GBP'
        baseCurrency.clear();
        baseCurrency.sendKeys(newBaseCurrency);
        expect(baseCurrency.getAttribute('value')).toBe(newBaseCurrency);

        let counterCurrency = element(by.id('counterCurrency_0'));
        let newCounterCurrency = 'ETH';
        counterCurrency.clear();
        counterCurrency.sendKeys(newCounterCurrency);
        expect(counterCurrency.getAttribute('value')).toBe(newCounterCurrency);

        let tradingStrategy = element(by.id('tradingStrategy_0'));
        let newTradingStrategy = 'com.my.new.Strat';
        tradingStrategy.clear();
        tradingStrategy.sendKeys(newTradingStrategy);
        expect(tradingStrategy.getAttribute('value')).toBe(newTradingStrategy);

        // Save and check the update worked
        let saveButton = element(by.id('saveButton'));
        saveButton.click();
        dashboardItems.get(4).click();
        tabLinks.get(1).click();

        expect(element(by.id('marketName_0')).getAttribute('value')).toBe(newMarketName);
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe(newBaseCurrency);
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe(newCounterCurrency);
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
