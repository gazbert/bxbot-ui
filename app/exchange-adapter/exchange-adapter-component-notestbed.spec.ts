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

    let expectedUpdatedExchangeAdapter: ExchangeAdapter;

    let spyExchangeAdapterDataService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter',
            expectedNetworkConfig);

        expectedUpdatedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.NewBtceExchangeAdapter',
            expectedNetworkConfig);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataPromiseService',
            ['getExchangeAdapterByExchangeId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.and.returnValue(Promise.resolve(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Promise.resolve(expectedUpdatedExchangeAdapter));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeAdapterDataService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.calls.first().returnValue.then(done);
    });

    it('should expose the ExchangeAdapter retrieved from ExchangeAdapterDataService', () => {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);
    });

    it('should navigate when click Cancel', () => {
        exchangeAdapterComponent.goToDashboard();
        expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    });

    it('should save when click Save', done => {
        exchangeAdapterComponent.save(true);
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then((updatedAdapter) => {
                expect(updatedAdapter).toBe(expectedUpdatedExchangeAdapter);
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });

    it('should NOT save when click Save for invalid input', () => {
        exchangeAdapterComponent.save(false);
    });

    it('should navigate when click Save resolves', done => {
        exchangeAdapterComponent.save(true);

        // waits for async save to complete before navigating
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});
