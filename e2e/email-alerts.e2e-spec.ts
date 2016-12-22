/******************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Email Alerts screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ******************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Email Alert Config screen tests.
 *
 * TODO - Tests for updating/validating fields
 * TODO - Tests for save and cancel
 */
describe('Email Alerts Config Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render Bitstamp Email Alerts config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Exchange Details');

        let tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('solo');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('NeverTellMeTheOdds!');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('lando@cloudcity.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('han.solo@falcon.space');
    });
});
