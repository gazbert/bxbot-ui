import {ActivatedRouteStub} from '../../../testing';
import {ExchangeComponent} from './exchange.component';
import {Exchange, NetworkConfig, ConfigItem, OptionalConfig} from '../model/exchange';

/**
 * Tests the behaviour of the Exchange  component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests without using the TestBed.
 *
 * I think I prefer not using the TestBed - less code to write, less API to learn, more intuitive using pure Jasmine,
 * and you're decoupled from UI changes by accessing the model directly.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('ExchangeComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeComponent: ExchangeComponent;

    let expectedExchange: Exchange;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: number[];
    let expectedErrorMsgs: string[];

    let expectedBuyFeeConfigItem: ConfigItem;
    let expectedSellFeeConfigItem: ConfigItem;
    let expectedOptionalConfig: OptionalConfig;

    let expectedUpdatedExchange: Exchange;

    let spyExchangeDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [501];
        expectedErrorMsgs = ['Connection timeout'];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedBuyFeeConfigItem = new ConfigItem('buy-fee', '0.2');
        expectedSellFeeConfigItem = new ConfigItem('sell-fee', '0.25');
        expectedOptionalConfig = new OptionalConfig([expectedBuyFeeConfigItem, expectedSellFeeConfigItem]);

        expectedExchange = new Exchange('huobi', 'Huobi', 'com.gazbert.bxbot.adapter.HuobiExchangeAdapter',
            expectedNetworkConfig, expectedOptionalConfig);

        expectedUpdatedExchange = new Exchange('huobi', 'Huobi', 'com.gazbert.bxbot.adapter.NewHuobiExchangeAdapter',
            expectedNetworkConfig, expectedOptionalConfig);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchange.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeDataService = jasmine.createSpyObj('ExchangeHttpDataPromiseService', ['getExchangeByBotId', 'updateExchange']);
        spyExchangeDataService.getExchangeByBotId.and.returnValue(Promise.resolve(expectedExchange));
        spyExchangeDataService.updateExchange.and.returnValue(Promise.resolve(expectedUpdatedExchange));

        exchangeComponent = new ExchangeComponent(spyExchangeDataService, <any> activatedRoute, router);
        exchangeComponent.ngOnInit();

        spyExchangeDataService.getExchangeByBotId.calls.first().returnValue.then(done);
    });

    it('should expose Exchange config retrieved from ExchangeHttpDataPromiseService', () => {
        expect(exchangeComponent.exchange).toBe(expectedExchange);

        // paranoia ;-)
        expect(exchangeComponent.exchange.id).toBe('huobi');
        expect(exchangeComponent.exchange.name).toBe('Huobi');
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes[0]).toBe(501);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        exchangeComponent.save(true);
        spyExchangeDataService.updateExchange.calls.first().returnValue
            .then((updatedExchange) => {
                expect(updatedExchange).toBe(expectedUpdatedExchange);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        exchangeComponent.cancel();
        expect(spyExchangeDataService.updateExchange.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        exchangeComponent.save(false);
        expect(spyExchangeDataService.updateExchange.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', () => {
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeComponent.addErrorCode();
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
    });

    it('should remove Error Code when user deletes one', () => {
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        exchangeComponent.deleteErrorCode(expectedErrorCodes[0]);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    it('should create new Error Message when user adds one', () => {
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeComponent.addErrorMessage();
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages[1]).toBe('');
    });

    it('should remove Error Message when user deletes one', () => {
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages.length).toBe(1);
        exchangeComponent.deleteErrorMessage(expectedErrorMsgs[0]);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(exchangeComponent.exchange.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });

    it('should create new Config Item when user adds one', () => {
        expect(exchangeComponent.exchange.optionalConfig.configItems.length).toBe(2);
        expect(exchangeComponent.exchange.optionalConfig.configItems[2]).not.toBeDefined();

        exchangeComponent.addOptionalConfigItem();
        expect(exchangeComponent.exchange.optionalConfig.configItems.length).toBe(3);
        expect(exchangeComponent.exchange.optionalConfig.configItems[2].name).toBe('');
        expect(exchangeComponent.exchange.optionalConfig.configItems[2].value).toBe('');
    });

    it('should remove Config Item when user deletes one', () => {
        expect(exchangeComponent.exchange.optionalConfig.configItems.length).toBe(2);
        exchangeComponent.deleteOptionalConfigItem(expectedBuyFeeConfigItem);
        expect(exchangeComponent.exchange.optionalConfig.configItems.length).toBe(1);
        expect(exchangeComponent.exchange.optionalConfig.configItems[1]).not.toBeDefined();
    });
});
