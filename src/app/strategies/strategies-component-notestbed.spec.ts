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
    let tradingStrategiesComponent: StrategiesComponent;

    const configItemToDelete = new ConfigItem('item-to-delete', 'some-value');

    let expectedTradingStrategies = [];
    let expectedTradingStrategy_1: Strategy;
    let expectedTradingStrategy_2: Strategy;
    let expectedUpdatedTradingStrategy_2: Strategy;
    let unusedTradingStrategy: Strategy;

    let expectedMarkets = [];
    let expectedMarket_1: Market;
    let expectedMarket_2: Market;

    let spyTradingStrategyDataService: any;
    let spyMarketDataService: any;
    let router: any;

    beforeEach(done => {

        expectedTradingStrategy_1 = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
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

        expectedTradingStrategy_2 = new Strategy('gdax_ema', 'gdax-2', 'EMA Indicator',
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

        unusedTradingStrategy = new Strategy('gdax_not_used', 'gdax-2', 'EMA Indicator',
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

        expectedUpdatedTradingStrategy_2 = new Strategy('gdax_scalper', 'gdax-2', 'Long Scalper',
            'Scalper that buys low and sells high, like duh.', 'com.gazbert.bxbot.strategies.LongScalper',
            new OptionalConfig([
                {
                    name: 'min-percentage-gain',
                    value: '0.75'
                }
            ]));

        expectedTradingStrategies = [expectedTradingStrategy_1, expectedTradingStrategy_2, unusedTradingStrategy];

        expectedMarket_1 = new Market('gdax_btc_usd', 'gdax-2', 'BTC/USD', true, 'BTC', 'USD', expectedTradingStrategy_1);
        expectedMarket_2 = new Market('gdax_btc_gbp', 'gdax-2', 'BTC/GBP', true, 'BTC', 'GBP', expectedTradingStrategy_2);
        expectedMarkets = [expectedMarket_1, expectedMarket_2];

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedTradingStrategy_1.botId};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyTradingStrategyDataService = jasmine.createSpyObj('TradingStrategiesHttpDataPromiseService',
            ['getAllStrategiesForBotId', 'updateStrategy', 'deleteStrategyById']);
        spyTradingStrategyDataService.getAllStrategiesForBotId.and.returnValue(Promise.resolve(expectedTradingStrategies));
        spyTradingStrategyDataService.updateStrategy.and.returnValue(Promise.resolve(expectedUpdatedTradingStrategy_2));

        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService', ['getAllMarketsForBotId']);
        spyMarketDataService.getAllMarketsForBotId.and.returnValue(Promise.resolve(expectedMarkets));

        tradingStrategiesComponent = new StrategiesComponent(spyTradingStrategyDataService, spyMarketDataService,
            <any> activatedRoute, router);

        tradingStrategiesComponent.ngOnInit();

        // OnInit calls TradingStrategiesComponent.getAllTradingStrategiesForExchange; wait for it to get the exchanges
        spyTradingStrategyDataService.getAllStrategiesForBotId.calls.first().returnValue.then(done);
    });

    it('should expose Trading Strategies retrieved from TradingStrategyDataService', () => {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);

        // paranoia ;-)
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        expect(tradingStrategiesComponent.tradingStrategies[0].id).toBe('gdax_macd');
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[0].name).toBe('ema-short-interval');
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[0].value).toBe('12');
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        tradingStrategiesComponent.save(true);
        spyTradingStrategyDataService.updateStrategy.calls.first().returnValue
            .then((updatedStrategy) => {
                expect(updatedStrategy).toBe(expectedUpdatedTradingStrategy_2);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        tradingStrategiesComponent.cancel();
        expect(spyTradingStrategyDataService.updateStrategy.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        tradingStrategiesComponent.save(false);
        expect(spyTradingStrategyDataService.updateStrategy.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should NOT remove Trading Strategy currently being used by a Market', (done) => {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(expectedTradingStrategy_1); // being used
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
                expect(tradingStrategiesComponent.deletedTradingStrategies.length).toBe(0);
                done();
            });
    });

    it('should remove Trading Strategy not being used by a Market', (done) => {
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);
        tradingStrategiesComponent.deleteTradingStrategy(unusedTradingStrategy);
        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue
            .then((markets) => {
                // paranoia ;-)
                expect(markets.length).toBe(2);
                expect(markets[0].tradingStrategy.id).toBe('gdax_macd');
                expect(markets[0].tradingStrategy.name).toBe('MACD Indicator');
                expect(markets[1].tradingStrategy.id).toBe('gdax_ema');
                expect(markets[1].tradingStrategy.name).toBe('EMA Indicator');

                expect(tradingStrategiesComponent.tradingStrategies.length).toBe(2);
                expect(tradingStrategiesComponent.deletedTradingStrategies.length).toBe(1);
                done();
            });
    });

    it('should add new Trading Strategy', () => {
        expect(tradingStrategiesComponent.tradingStrategies).toBe(expectedTradingStrategies);
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(3);

        tradingStrategiesComponent.addTradingStrategy();
        expect(tradingStrategiesComponent.tradingStrategies.length).toBe(4);
        expect(tradingStrategiesComponent.tradingStrategies[3].id).not.toBeNull();
        expect(tradingStrategiesComponent.tradingStrategies[3].botId).toBe('gdax-2');
        expect(tradingStrategiesComponent.tradingStrategies[3].name).toBe(null);
    });

    it('should create new Config Item when user adds one', () => {
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems.length).toBe(3);
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[3]).not.toBeDefined();

        tradingStrategiesComponent.addOptionalConfigItem(expectedTradingStrategy_1);
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems.length).toBe(4);
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[3].name).toBe('');
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[3].value).toBe('');
    });

    it('should remove Config Item when user deletes one', () => {
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems.length).toBe(3);
        tradingStrategiesComponent.deleteOptionalConfigItem(expectedTradingStrategy_1, configItemToDelete);
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems.length).toBe(2);
        expect(tradingStrategiesComponent.tradingStrategies[0].optionalConfig.configItems[3]).not.toBeDefined();
    });
});
