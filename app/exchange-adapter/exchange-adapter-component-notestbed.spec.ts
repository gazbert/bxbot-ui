import {ActivatedRouteStub} from "../../testing";
import {Exchange, NetworkConfig, ErrorCode, ErrorMessage} from "../model";
import {ExchangeAdapterComponent} from "./exchange-adapter.component";

/**
 * Tests the behaviour of the Exchange Adapter (template) component is as expected.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO When should I/should I not use the testbed?
 * TODO Increase coverage for the form input + validation, adding/deleting error/message codes, etc...
 *
 * @author gazbert
 */
describe('ExchangeAdapterComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeAdapterComponent: ExchangeAdapterComponent;

    let expectedExchange: Exchange;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: ErrorCode[];
    let expectedErrorMsgs: ErrorMessage[];

    let spyExchangeDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchange = new Exchange('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', expectedNetworkConfig, null, null);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchange.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeDataService = jasmine.createSpyObj('ExchangeHttpDataPromiseService', ['getExchange', 'update']);
        spyExchangeDataService.getExchange.and.returnValue(Promise.resolve(expectedExchange));
        spyExchangeDataService.update.and.returnValue(Promise.resolve(expectedExchange));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeDataService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeDataService.getExchange.calls.first().returnValue.then(done);
    });

    it('should expose the Exchange retrieved from the service', () => {
        expect(exchangeAdapterComponent.exchange).toBe(expectedExchange);
    });

    it('should navigate when click Cancel', () => {
        exchangeAdapterComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click Save', () => {
        exchangeAdapterComponent.save();
        expect(spyExchangeDataService.update.calls.any()).toBe(true, 'ExchangeAdapterService.saveExchange called');
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate not called yet');
    });

    it('should navigate when click Save resolves', done => {
        exchangeAdapterComponent.save();

        // waits for async save to complete before navigating
        spyExchangeDataService.update.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});