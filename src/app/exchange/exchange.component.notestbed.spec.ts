import {ActivatedRouteStub} from '../../../testing';
import {ExchangeAdapterComponent} from './exchange.component';
import {Exchange, NetworkConfig} from '../model/exchange';
import {ConfigItem, OptionalConfig} from '../model/exchange/exchange.model';

/**
 * Tests the behaviour of the Exchange Adapter component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests without using the TestBed.
 *
 * I think I prefer not using the TestBed - less code to write, less API to lean, more intuitive using pure Jasmine,
 * and you're decoupled from UI changes by accessing the model directly.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('ExchangeAdapterComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeAdapterComponent: ExchangeAdapterComponent;

    let expectedExchangeAdapter: Exchange;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: number[];
    let expectedErrorMsgs: string[];

    let expectedBuyFeeConfigItem: ConfigItem;
    let expectedSellFeeConfigItem: ConfigItem;
    let expectedOptionalConfig: OptionalConfig;

    let expectedUpdatedExchangeAdapter: Exchange;

    let spyExchangeAdapterDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [501];
        expectedErrorMsgs = ['Connection timeout'];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedBuyFeeConfigItem = new ConfigItem('buy-fee', '0.2');
        expectedSellFeeConfigItem = new ConfigItem('sell-fee', '0.25');
        expectedOptionalConfig = new OptionalConfig([expectedBuyFeeConfigItem, expectedSellFeeConfigItem]);

        expectedExchangeAdapter = new Exchange('huobi', 'Huobi', 'com.gazbert.bxbot.adapter.HuobiExchangeAdapter',
            expectedNetworkConfig, expectedOptionalConfig);

        expectedUpdatedExchangeAdapter = new Exchange('huobi', 'Huobi', 'com.gazbert.bxbot.adapter.NewHuobiExchangeAdapter',
            expectedNetworkConfig, expectedOptionalConfig);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataPromiseService',
            ['getExchangeAdapterByBotId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByBotId.and.returnValue(Promise.resolve(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Promise.resolve(expectedUpdatedExchangeAdapter));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeAdapterDataService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeAdapterDataService.getExchangeAdapterByBotId.calls.first().returnValue.then(done);
    });

    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', () => {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);

        // paranoia ;-)
        expect(exchangeAdapterComponent.exchangeAdapter.id).toBe('huobi');
        expect(exchangeAdapterComponent.exchangeAdapter.name).toBe('Huobi');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).toBe(501);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        exchangeAdapterComponent.save(true);
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then((updatedAdapter) => {
                expect(updatedAdapter).toBe(expectedUpdatedExchangeAdapter);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        exchangeAdapterComponent.cancel();
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        exchangeAdapterComponent.save(false);
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorCode();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
    });

    it('should remove Error Code when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        exchangeAdapterComponent.deleteErrorCode(expectedErrorCodes[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    it('should create new Error Message when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorMessage();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe('');
    });

    it('should remove Error Message when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        exchangeAdapterComponent.deleteErrorMessage(expectedErrorMsgs[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });

    it('should create new Config Item when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems[2]).not.toBeDefined();

        exchangeAdapterComponent.addOptionalConfigItem();
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems.length).toBe(3);
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems[2].name).toBe('');
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems[2].value).toBe('');
    });

    it('should remove Config Item when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems.length).toBe(2);
        exchangeAdapterComponent.deleteOptionalConfigItem(expectedBuyFeeConfigItem);
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.optionalConfig.configItems[1]).not.toBeDefined();
    });
});
