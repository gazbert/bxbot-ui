/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing BX-bot UI behaviour.
 *
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

    it('should display browser title: ' + expectedMsg, function () {
        expect(browser.getTitle()).toEqual(expectedMsg);
    });

    it('should display admin console heading name: ' + expectedMsg, function () {
        expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
    });

    // TODO FIXME - how do I access the exchange list?
    // it('should display 8 Exchange items', function () {
    //     var dashboardItems = element.all(by.repeater('exchange in exchanges'));
    //     expect(dashboardItems.count()).toBe(8);
    // });

});

/**
 * Exchange Details screen tests.
 */
describe('Exchange Details Tests', function () {

    let expectedMsg = 'GDAX Exchange Details';

    beforeEach(function () {
        browser.get('/exchange/gdax');
    });

    // TODO FIXME - times out :-(
    // it('should display GDAX Exchange Details in title: ' + expectedMsg, function () {
    //     expect(element(by.css('h2')).getText()).toEqual(expectedMsg);
    // });
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







