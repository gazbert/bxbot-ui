/*********************************************************************************
 *
 * End 2 End Protractor tests (using Jasmine) for testing Exchange Adapter screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 ********************************************************************************/
import {browser, element, by} from "protractor";

/**
 * Exchange Adapter screen tests.
 *
 * TODO - Tests for add/remove error codes and error messages
 * TODO - Tests for updating/validating fields
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
