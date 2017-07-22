"use strict";
var testing_1 = require("../../testing");
var exchange_adapter_component_1 = require("./exchange-adapter.component");
var exchange_adapter_1 = require("../model/exchange-adapter");
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
describe('ExchangeAdapterComponent tests without TestBed', function () {
    var activatedRoute;
    var exchangeAdapterComponent;
    var expectedExchangeAdapter;
    var expectedNetworkConfig;
    var expectedErrorCodes;
    var expectedErrorMsgs;
    var expectedUpdatedExchangeAdapter;
    var spyExchangeAdapterDataService;
    var router;
    beforeEach(function (done) {
        expectedErrorCodes = [501];
        expectedErrorMsgs = ['Connection timeout'];
        expectedNetworkConfig = new exchange_adapter_1.NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
        expectedExchangeAdapter = new exchange_adapter_1.ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', 1, expectedNetworkConfig);
        expectedUpdatedExchangeAdapter = new exchange_adapter_1.ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.NewBtceExchangeAdapter', 2, expectedNetworkConfig);
        activatedRoute = new testing_1.ActivatedRouteStub();
        activatedRoute.testParams = { id: expectedExchangeAdapter.botId };
        router = jasmine.createSpyObj('router', ['navigate']);
        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataPromiseService', ['getExchangeAdapterByBotId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByBotId.and.returnValue(Promise.resolve(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Promise.resolve(expectedUpdatedExchangeAdapter));
        exchangeAdapterComponent = new exchange_adapter_component_1.ExchangeAdapterComponent(spyExchangeAdapterDataService, activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();
        spyExchangeAdapterDataService.getExchangeAdapterByBotId.calls.first().returnValue.then(done);
    });
    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', function () {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);
        // paranoia ;-)
        expect(exchangeAdapterComponent.exchangeAdapter.id).toBe('btce');
        expect(exchangeAdapterComponent.exchangeAdapter.name).toBe('BTC-e');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).toBe(501);
    });
    it('should save and navigate to Dashboard when user clicks Save for valid input', function (done) {
        exchangeAdapterComponent.save(true);
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then(function (updatedAdapter) {
            expect(updatedAdapter).toBe(expectedUpdatedExchangeAdapter);
            expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
            done();
        });
    });
    it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
        exchangeAdapterComponent.cancel();
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });
    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
        exchangeAdapterComponent.save(false);
        expect(spyExchangeAdapterDataService.update.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
    it('should create new Error Code when user adds one', function () {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorCode();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeNull();
    });
    xit('should create new Error Message when user adds one', function () {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorMessage('We are ready at last to set sail for the stars.');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe('We are ready at last to set sail for the stars.');
    });
    it('should remove Error Code when user deletes one', function () {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorCode(expectedErrorCodes[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });
    xit('should remove Error Message when user deletes one', function () {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorMessage(expectedErrorMsgs[0]);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });
});
//# sourceMappingURL=exchange-adapter.component.notestbed.spec.js.map