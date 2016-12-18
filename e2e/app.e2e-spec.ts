/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing BX-bot UI behaviour.
 * See: http://www.protractortest.org/#/tutorial
 *
 ******************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Dashboard tests.
 */
describe('Dashboard Tests', function () {

    let expectedMsg = 'BX-bot Admin Console';

    beforeEach(function () {
        browser.get('');
    });

    it('Should redirect blank base URL to /dashboard', function () {
        browser.getCurrentUrl().then(function (url) {
            expect(url).toContain('/dashboard');
        });
    });

    it('should display browser title: ' + expectedMsg, function () {
        expect(browser.getTitle()).toEqual(expectedMsg);
    });

    it('should display admin console heading name: ' + expectedMsg, function () {
        expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
    });

    it('should display 8 dashboard Exchange items', function () {

        // TODO below does not work with Angular2 :-(
        // let dashboardItems = element.all(by.repeater('exchange in exchanges'));

        // so we'll resort to CSS locator instead
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.count()).toBe(8);
    });

    it('first dashboard Exchange item should be Bitstamp', function () {
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.get(0).getText()).toContain('Bitstamp');
    });

    it('last dashboard Exchange item should be Huobi', function () {
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.get(7).getText()).toContain('Huobi');
    });

    it('Should render Gemini Exchange specific link', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();

        browser.getCurrentUrl().then(function (url) {
            expect(url).toContain('/exchange/gemini');
        });
    });
});

/**
 * Exchange Details screen tests.
 *
 * TODO - Test for Dashboard click
 * TODO - Tests for nav to Markets, Strats, Email Alerts
 */
describe('Exchange Details Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render GDAX Exchange specific details', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Exchange Details');

        let tabLinks = element.all(by.css('li'));
        expect(tabLinks.count()).toBe(4);
        expect(tabLinks.first().getText()).toEqual('Exchange Adapter');
        expect(tabLinks.get(1).getText()).toEqual('Markets');
        expect(tabLinks.get(2).getText()).toEqual('Trading Strategies');
        expect(tabLinks.last().getText()).toEqual('Email Alerts');

        let tabItems = element.all(by.css('tab'));
        expect(tabItems.count()).toBe(4);
    });
});

/**
 * Exchange Adapter screen tests.
 *
 * TODO - Tests for add/remove error codes and error messages
 * TODO - Tests for save and cancel
 */
describe('Exchange Adapter Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render ItBit Exchange Adapter config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        expect(element(by.id('exchangeId')).getAttribute('value')).toBe('itbit');
        expect(element(by.id('adapter')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.ItBitExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('30');

        // TODO check error codes and message values
    });
});


/**
 * Market screen tests.
 *
 * TODO - Tests for add/remove markets
 * TODO - Tests for save and cancel
 */
describe('Market Tests', function () {

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







