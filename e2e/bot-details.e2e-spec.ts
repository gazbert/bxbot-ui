import {browser, element, by} from 'protractor';

/**
 * Bot Details screen tests.
 *
 * End 2 End Protractor tests (using Jasmine) for testing Bot Details screen.
 * See: http://www.protractortest.org/#/tutorial
 *
 * TODO - Use by.repeater()/model() instead of by.css() once Angular implement it for lists:
 * https://angular.io/docs/ts/latest/guide/upgrade.html
 * https://github.com/angular/protractor/issues/3205
 *
 * @author gazbert
 */
describe('Bot Details Tests', function () {

    beforeEach(function () {
        browser.get('');
    });

    it('should render GDAX Bot Details tab links', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        const tabLinks = element.all(by.css('li'));
        expect(tabLinks.count()).toBe(5);
        expect(tabLinks.first().getText()).toEqual('Engine');
        expect(tabLinks.get(1).getText()).toEqual('Exchange Adapter');
        expect(tabLinks.get(2).getText()).toEqual('Markets');
        expect(tabLinks.get(3).getText()).toEqual('Strategies');
        expect(tabLinks.last().getText()).toEqual('Email Alerts');

        const tabItems = element.all(by.css('app-bxbot-ui-tab'));
        expect(tabItems.count()).toBe(5);
    });

    it('should render GDAX Engine Details', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        expect(element(by.id('botId')).getAttribute('value')).toBe('gdax-1');
        expect(element(by.id('botName')).getAttribute('value')).toBe('GDAX');
        expect(element(by.id('tradeCycleInterval')).getAttribute('value')).toBe('10');
        expect(element(by.id('emergencyStopCurrency')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('emergencyStopBalance')).getAttribute('value')).toBe('0.8');
    });

    it('should render GDAX Exchange Details', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(1).click();

        expect(element(by.id('exchangeName')).getAttribute('value')).toBe('GDAX');
        expect(element(by.id('className')).getAttribute('value')).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
        expect(element(by.id('connectionTimeout')).getAttribute('value')).toBe('120');
        expect(element(by.id('errorCode_0')).getAttribute('value')).toBe('503');
        expect(element(by.id('errorCode_1')).getAttribute('value')).toBe('522');
        expect(element(by.id('errorMessage_0')).getAttribute('value')).toBe('Connection reset');
        expect(element(by.id('errorMessage_1')).getAttribute('value')).toBe('Connection refused');
    });

    it('should render GDAX Markets', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(2).click();

        // Market 1
        expect(element(by.id('marketEnabled_0')).getAttribute('ng-reflect-model')).toBe('false'); // must be better way?
        expect(element(by.id('marketName_0')).getAttribute('value')).toBe('BTC/USD');
        expect(element(by.id('baseCurrency_0')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_0')).getAttribute('value')).toBe('USD');
        expect(element(by.id('strategy_0')).getAttribute('value')).toBe('1: EMA Indicator');

        // Market 2
        expect(element(by.id('marketEnabled_1')).getAttribute('ng-reflect-model')).toBe('true');
        expect(element(by.id('marketName_1')).getAttribute('value')).toBe('BTC/GBP');
        expect(element(by.id('baseCurrency_1')).getAttribute('value')).toBe('BTC');
        expect(element(by.id('counterCurrency_1')).getAttribute('value')).toBe('GBP');
        expect(element(by.id('strategy_1')).getAttribute('value')).toBe('0: Long Scalper');
    });

    it('should render GDAX Strategies', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(3).click();

        // Strat 1
        expect(element(by.id('strategyName_0')).getAttribute('value')).toBe('Long Scalper');
        expect(element(by.id('strategyDescription_0')).getAttribute('value'))
            .toBe('Scalping strategy that buys low and sells high.');
        expect(element(by.id('strategyClassname_0')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.LongScalperStrategy');

        // Strat 2
        expect(element(by.id('strategyName_1')).getAttribute('value')).toBe('EMA Indicator');
        expect(element(by.id('strategyDescription_1')).getAttribute('value'))
            .toBe('EMA Indicator algo for deciding when to enter and exit trades.');
        expect(element(by.id('strategyClassname_1')).getAttribute('value'))
            .toBe('com.gazbert.bxbot.strategies.EmaStrategy');
    });

    it('should render GDAX Email Alerts Config', function () {

        const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
        dashboardItems.get(1).click();
        expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

        const tabLinks = element.all(by.css('li'));
        tabLinks.get(4).click();

        expect(element(by.id('alertsEnabled')).getAttribute('value')).toBe('on');
        expect(element(by.id('accountUsername')).getAttribute('value')).toBe('solo');
        expect(element(by.id('accountPassword')).getAttribute('value')).toBe('NeverTellMeTheOdds_');
        expect(element(by.id('toAddress')).getAttribute('value')).toBe('lando@cloudcity.space');
        expect(element(by.id('fromAddress')).getAttribute('value')).toBe('han.solo@falcon.space');
    });

    it('should navigate to Dashboard if user clicks on Dashboard button', function () {

        browser.getCurrentUrl().then(function (url) {

            const dashboardItems = element.all(by.css('app-bxbot-ui-dashboard-item'));
            dashboardItems.get(1).click();
            expect(element(by.css('h2')).getText()).toEqual('GDAX Details');

            const dashboardButton = element.all(by.css('dashboardButton'));
            dashboardButton.click();
            expect(url).toContain('/dashboard');
        });
    });
});
