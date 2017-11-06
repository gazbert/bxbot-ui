import {ActivatedRouteStub} from '../../../testing';
import {StrategiesComponent} from './strategies.component';
import {Strategy, OptionalConfig, ConfigItem} from '../model/strategy';
import {Market} from '../model/market';

/**
 * Tests the behaviour of the Strategies component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('StrategiesComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let strategiesComponent: StrategiesComponent;

    const configItemToDelete = new ConfigItem('item-to-delete', 'some-value');

    let expectedStrategies = [];
    let expectedStrategy_1: Strategy;
    let expectedStrategy_2: Strategy;
    let expectedUpdatedStrategy_2: Strategy;
    let unusedStrategy: Strategy;

    let expectedMarkets = [];
    let expectedMarket_1: Market;
    let expectedMarket_2: Market;

    let spyStrategyDataService: any;
    let spyMarketDataService: any;
    let router: any;

    beforeEach(done => {

        expectedStrategy_1 = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                },
                configItemToDelete
            ]));

        expectedStrategy_2 = new Strategy('gdax_ema', 'gdax-2', 'EMA Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy',
            new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                }
            ]));

        unusedStrategy = new Strategy('gdax_not_used', 'gdax-2', 'EMA Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy',
            new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                }
            ]));

        expectedUpdatedStrategy_2 = new Strategy('gdax_scalper', 'gdax-2', 'Long Scalper',
            'Scalper that buys low and sells high, like duh.', 'com.gazbert.bxbot.strategies.LongScalper',
            new OptionalConfig([
                {
                    name: 'min-percentage-gain',
                    value: '0.75'
                }
            ]));

        expectedStrategies = [expectedStrategy_1, expectedStrategy_2, unusedStrategy];

        expectedMarket_1 = new Market('gdax_btc_usd', 'gdax-2', 'BTC/USD', true, 'BTC', 'USD', expectedStrategy_1);
        expectedMarket_2 = new Market('gdax_btc_gbp', 'gdax-2', 'BTC/GBP', true, 'BTC', 'GBP', expectedStrategy_2);
        expectedMarkets = [expectedMarket_1, expectedMarket_2];

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedStrategy_1.botId};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyStrategyDataService = jasmine.createSpyObj('StrategiesHttpDataPromiseService',
            ['getAllStrategiesForBotId', 'updateStrategy', 'deleteStrategyById']);
        spyStrategyDataService.getAllStrategiesForBotId.and.returnValue(Promise.resolve(expectedStrategies));
        spyStrategyDataService.updateStrategy.and.returnValue(Promise.resolve(expectedUpdatedStrategy_2));

        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService', ['getAllMarketsForBotId']);
        spyMarketDataService.getAllMarketsForBotId.and.returnValue(Promise.resolve(expectedMarkets));

        strategiesComponent = new StrategiesComponent(spyStrategyDataService, spyMarketDataService,
            <any> activatedRoute, router);

        strategiesComponent.ngOnInit();

        // OnInit calls StrategiesComponent.getAllStrategiesForBotId; wait for it to get the strats
        spyStrategyDataService.getAllStrategiesForBotId.calls.first().returnValue.then(done);
    });

    it('should expose Strategies retrieved from StrategyDataService', () => {
        expect(strategiesComponent.strategies).toBe(expectedStrategies);

        // paranoia ;-)
        expect(strategiesComponent.strategies.length).toBe(3);
        expect(strategiesComponent.strategies[0].id).toBe('gdax_macd');
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[0].name).toBe('ema-short-interval');
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[0].value).toBe('12');
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        strategiesComponent.save(true);
        spyStrategyDataService.updateStrategy.calls.first().returnValue
            .then((updatedStrategy) => {
                expect(updatedStrategy).toBe(expectedUpdatedStrategy_2);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        strategiesComponent.cancel();
        expect(spyStrategyDataService.updateStrategy.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        strategiesComponent.save(false);
        expect(spyStrategyDataService.updateStrategy.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should NOT remove Strategy currently being used by a Market', (done) => {
        expect(strategiesComponent.strategies.length).toBe(3);
        strategiesComponent.deleteStrategy(expectedStrategy_1); // being used
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(strategiesComponent.strategies.length).toBe(3);
                expect(strategiesComponent.deletedStrategies.length).toBe(0);
                done();
            });
    });

    it('should remove Strategy not being used by a Market', (done) => {
        expect(strategiesComponent.strategies.length).toBe(3);
        strategiesComponent.deleteStrategy(unusedStrategy);
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(strategiesComponent.strategies.length).toBe(2);
                expect(strategiesComponent.deletedStrategies.length).toBe(1);
                done();
            });
    });

    it('should add new Strategy', () => {
        expect(strategiesComponent.strategies).toBe(expectedStrategies);
        expect(strategiesComponent.strategies.length).toBe(3);

        strategiesComponent.addStrategy();
        expect(strategiesComponent.strategies.length).toBe(4);
        expect(strategiesComponent.strategies[3].id).not.toBeNull();
        expect(strategiesComponent.strategies[3].botId).toBe('gdax-2');
        expect(strategiesComponent.strategies[3].name).toBe(null);
    });

    it('should create new Config Item when user adds one', () => {
        expect(strategiesComponent.strategies[0].optionalConfig.configItems.length).toBe(3);
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[3]).not.toBeDefined();

        strategiesComponent.addOptionalConfigItem(expectedStrategy_1);
        expect(strategiesComponent.strategies[0].optionalConfig.configItems.length).toBe(4);
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[3].name).toBe('');
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[3].value).toBe('');
    });

    it('should remove Config Item when user deletes one', () => {
        expect(strategiesComponent.strategies[0].optionalConfig.configItems.length).toBe(3);
        strategiesComponent.deleteOptionalConfigItem(expectedStrategy_1, configItemToDelete);
        expect(strategiesComponent.strategies[0].optionalConfig.configItems.length).toBe(2);
        expect(strategiesComponent.strategies[0].optionalConfig.configItems[3]).not.toBeDefined();
    });
});
