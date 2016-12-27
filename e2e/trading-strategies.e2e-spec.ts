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
import {browser, element, by} from "protractor";

/**
 * Trading Strategies screen tests.
 *
 * TODO - Tests for add/remove strats
 * TODO - Tests for updating/validating fields
 * TODO - Tests for save and cancel
 */
describe('Trading Strategy Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('Should render ItBit Trading Strategy config', function () {

        let dashboardItems = element.all(by.css('bx-dashboard-item'));
        dashboardItems.get(3).click();
        expect(element(by.css('h2')).getText()).toEqual('ItBit Exchange Details');

        let tabLinks = element.all(by.css('li'));
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
    });
});
