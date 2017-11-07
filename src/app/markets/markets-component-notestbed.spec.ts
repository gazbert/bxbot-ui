import {ActivatedRouteStub} from '../../../testing';
import {MarketsComponent} from './markets.component';
import {Market} from '../model/market';
import {Strategy, OptionalConfig} from '../model/strategy';

/**
 * Tests the behaviour of the Markets component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('MarketsComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let marketsComponent: MarketsComponent;

    let expectedMarkets = [];
    let expectedMarket_1: Market;
    let expectedMarket_2: Market;

    let expectedUpdatedMarket_2: Market;

    let expectedStrategy_1: Strategy;
    let expectedStrategy_2: Strategy;

    let spyMarketDataService: any;
    let spyStrategyDataService: any;
    let router: any;

    beforeEach(done => {

        expectedStrategy_1 = new Strategy('gdax_macd', 'gdax-2', 'MACD Indicator',
            'MACD Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.MacdStrategy',
            new OptionalConfig([]));

        expectedMarket_1 = new Market('gdax_btc_usd', 'gdax-2', 'BTC/USD', true, 'BTC', 'USD', expectedStrategy_1);

        expectedStrategy_2 = new Strategy('gdax_ema', 'gdax-2', 'MACD Indicator',
            'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy',
            new OptionalConfig([]));

        expectedMarket_2 = new Market('gdax_btc_gbp', 'gdax-2', 'BTC/GBP', true, 'BTC', 'GBP', expectedStrategy_2);

        expectedMarkets = [expectedMarket_1, expectedMarket_2];

        expectedUpdatedMarket_2 = new Market('gdax_btc_gbp', 'gdax-2', 'ETH/USD', true, 'ETH', 'USD', expectedStrategy_2);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedMarket_1.botId};

        router = jasmine.createSpyObj('router', ['navigate']);

        // Just mock this out, not testing it here, has it's own tests suite.
        spyStrategyDataService = jasmine.createSpyObj('StrategyHttpDataService',
            ['getAllStrategiesForBotId']);
        spyStrategyDataService.getAllStrategiesForBotId.and.returnValues(Promise.resolve([]));

        // We are testing this tho...
        spyMarketDataService = jasmine.createSpyObj('MarketHttpDataPromiseService',
            ['getAllMarketsForBotId', 'updateMarket']);
        spyMarketDataService.getAllMarketsForBotId.and.returnValue(Promise.resolve(expectedMarkets));
        spyMarketDataService.updateMarket.and.returnValue(Promise.resolve(expectedUpdatedMarket_2));

        marketsComponent = new MarketsComponent(spyMarketDataService, spyStrategyDataService, <any> activatedRoute, router);
        marketsComponent.ngOnInit();

        spyMarketDataService.getAllMarketsForBotId.calls.first().returnValue.then(done);
    });

    it('should expose Markets retrieved from MarketDataService', () => {
        expect(marketsComponent.markets).toBe(expectedMarkets);

        // paranoia ;-)
        expect(marketsComponent.markets.length).toBe(2);
        expect(marketsComponent.markets[0].id).toBe('gdax_btc_usd');
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        marketsComponent.save(true);
        spyMarketDataService.updateMarket.calls.first().returnValue
            .then((updatedMarket) => {
                expect(updatedMarket).toBe(expectedUpdatedMarket_2);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });


    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        marketsComponent.cancel();
        expect(spyMarketDataService.updateMarket.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        marketsComponent.save(false);
        expect(spyMarketDataService.updateMarket.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should remove Market when user deletes one', () => {
        expect(marketsComponent.markets.length).toBe(2);
        marketsComponent.deleteMarket(expectedMarket_1);
        expect(marketsComponent.markets.length).toBe(1);
        expect(marketsComponent.deletedMarkets.length).toBe(1);
    });

    it('should add new Market when user adds one', () => {
        expect(marketsComponent.markets).toBe(expectedMarkets);
        expect(marketsComponent.markets.length).toBe(2);

        marketsComponent.addMarket();
        expect(marketsComponent.markets.length).toBe(3);
        expect(marketsComponent.markets[2].id).not.toBeNull();
        expect(marketsComponent.markets[2].botId).toBe('gdax-2');
        expect(marketsComponent.markets[2].name).toBe(null);
    });
});
