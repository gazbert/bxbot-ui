/*********************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Exchange Details screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ********************************************************************************/
import {browser, element, by} from "protractor";

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
