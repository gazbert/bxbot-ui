/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Dashboard screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * TODO - Add test for Dashboard search/filter box
 *
 ******************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Dashboard tests.
 *
 * @author gazbert
 */
describe('Dashboard Tests', function () {

    let expectedMsg = 'BX-bot Admin Console';

    beforeEach(function () {
        browser.get('');
    });

    it('should redirect Dashboard if user does not enter a URL path', function () {
        browser.getCurrentUrl().then(function (url) {
            expect(url).toContain('/dashboard');
        });
    });

    it('should display browser title: ' + expectedMsg, function () {
        expect(browser.getTitle()).toEqual(expectedMsg);
    });

    it('should display Admin Console heading name: ' + expectedMsg, function () {
        expect(element(by.css('h1')).getText()).toEqual(expectedMsg);
    });

    it('should display 8 Dashboard Bot items', function () {

        // TODO below does not work with Angular2 :-(
        // https://github.com/angular/protractor/issues/3205
        // let dashboardItems = element.all(by.repeater('bot in bots'));

        // so we'll resort to CSS locator instead
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.count()).toBe(8);
    });

    it('should display Bitstamp as first Dashboard Bot item', function () {
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.get(0).getText()).toContain('Bitstamp');
    });

    it('should display Huobi as last Dashboard Bot item', function () {
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.get(7).getText()).toContain('Huobi');
    });

    it('should render Gemini Bot specific link', function () {
        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(2).click();

        browser.getCurrentUrl().then(function (url) {
            expect(url).toContain('/bot/3');
        });
    });

    it('should stay on Dashboard if user clicks on Dashboard button', function () {
        browser.getCurrentUrl().then(function (url) {
            let dashboardButton = element.all(by.css('dashboardButton'));
            dashboardButton.click();
            expect(url).toContain('/dashboard');
        });
    });

    it('should filter displayed Bot items when user searches by Bot name', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        expect(dashboardItems.count()).toBe(8);

        let searchBox = element.all(by.id('search-box'));
        searchBox.sendKeys('Bit');

        expect(dashboardItems.count()).toBe(3);
        expect(dashboardItems.get(0).getText()).toContain('Bitstamp');
        expect(dashboardItems.get(1).getText()).toContain('ItBit');
        expect(dashboardItems.get(2).getText()).toContain('Bitfinex');

        searchBox.clear();
        searchBox.sendKeys('Ok');
        expect(dashboardItems.count()).toBe(1);
        expect(dashboardItems.get(0).getText()).toContain('OKCoin');

        searchBox.clear();
        searchBox.sendKeys('G');
        expect(dashboardItems.count()).toBe(2);
        expect(dashboardItems.get(0).getText()).toContain('GDAX');
        expect(dashboardItems.get(1).getText()).toContain('Gemini');
    });

});

