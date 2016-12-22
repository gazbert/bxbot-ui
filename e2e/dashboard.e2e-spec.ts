/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Dashboard screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
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
        // https://github.com/angular/protractor/issues/3205
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
