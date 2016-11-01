import {ActivatedRouteStub} from '../../testing';
import {ExchangeAdapterComponent} from './exchange-adapter.component';
import {ExchangeAdapter, NetworkConfig, ErrorCode, ErrorMessage} from '../model/exchange-adapter';

/**
 * Tests the behaviour of the Exchange Adapter (Template version) component is as expected.
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

    let expectedExchangeAdapter: ExchangeAdapter;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: ErrorCode[];
    let expectedErrorMsgs: ErrorMessage[];

    let spyExchangeAdapterDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchangeAdapter = new ExchangeAdapter('btce', 'btce', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter',
            expectedNetworkConfig);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataPromiseService',
            ['getExchangeAdapterByExchangeId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.and.returnValue(Promise.resolve(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Promise.resolve(expectedExchangeAdapter));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeAdapterDataService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.calls.first().returnValue.then(done);
    });

    it('should expose the Exchange Adapter retrieved from the service', () => {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);
    });

    it('should navigate when click Cancel', () => {
        exchangeAdapterComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click Save', () => {
        exchangeAdapterComponent.save();
        expect(spyExchangeAdapterDataService.update.calls.any()).toBe(true, 'ExchangeAdapterService.saveExchange called');
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate not called yet');
    });

    it('should navigate when click Save resolves', done => {
        exchangeAdapterComponent.save();

        // waits for async save to complete before navigating
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});
