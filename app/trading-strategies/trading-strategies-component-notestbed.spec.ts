import {ActivatedRouteStub} from '../../testing';
import {TradingStrategiesComponent} from './trading-strategies.component';
import {TradingStrategy} from '../model/trading-strategy';

/**
 * Tests the behaviour of the Trading Strategies component is as expected.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO Increase coverage for the form input + validation, adding/updating/deleting Trading Strategies.
 *
 * @author gazbert
 */
describe('TradingStrategiesComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let tradingStrategiesComponent: TradingStrategiesComponent;

    let expectedTradingStrategies = [];
    let expectedTradingStrategy_1: TradingStrategy;
    let expectedTradingStrategy_2: TradingStrategy;

    let expectedUpdatedTradingStrategy_2: TradingStrategy;

    let spyTradingStrategyDataService: any;
    let spyMarketDataService: any; // mock this out, not testing it here, has it's own tests suite.
    let router: any;

    beforeEach(done => {

        expectedTradingStrategy_1 = new TradingStrategy('gdax_macd', 'gdax', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy');

        expectedTradingStrategy_2 = new TradingStrategy('gdax_ema', 'gdax', 'EMA Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy');

        expectedTradingStrategies = [expectedTradingStrategy_1, expectedTradingStrategy_2];

        expectedUpdatedTradingStrategy_2 = new TradingStrategy('gdax_scalper', 'gdax', 'Long Scalper',
            'Scalper that buys low and sells high, like duh.', 'com.gazbert.bxbot.strategies.LongScalper');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedTradingStrategy_1.exchangeId};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategiesHttpDataPromiseService',
            ['getAllTradingStrategiesForExchange', 'updateTradingStrategy']);

        spyTradingStrategyDataService.getAllTradingStrategiesForExchange.and.returnValue(Promise.resolve(expectedTradingStrategies));
        spyTradingStrategyDataService.updateTradingStrategy.and.returnValue(Promise.resolve(expectedUpdatedTradingStrategy_2));

        tradingStrategiesComponent = new TradingStrategiesComponent(spyTradingStrategyDataService, spyMarketDataService,
            <any> activatedRoute, router);
        tradingStrategiesComponent.ngOnInit();

        spyTradingStrategyDataService.getAllTradingStrategiesForExchange.calls.first().returnValue.then(done);
    });

    it('should expose Trading Strategies retrieved from TradingStrategyDataService', () => {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);

        // paranoia ;-)
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(2);
        expect(tradingStrategiesComponent.tradingStrategies[0].id).toBe('gdax_macd');
    });

    it('should navigate when click Cancel', () => {
        tradingStrategiesComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click Save for valid input', done => {
        tradingStrategiesComponent.save(true);
        spyTradingStrategyDataService.updateTradingStrategy.calls.first().returnValue
            .then((updatedStrategy) => {
                expect(updatedStrategy).toBe(expectedUpdatedTradingStrategy_2);
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });

    it('should NOT save when click Save for invalid input', () => {
        tradingStrategiesComponent.save(false);
    });

    it('should navigate when click Save resolves', done => {
        tradingStrategiesComponent.save(true);

        // waits for async save to complete before navigating
        spyTradingStrategyDataService.updateTradingStrategy.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});
