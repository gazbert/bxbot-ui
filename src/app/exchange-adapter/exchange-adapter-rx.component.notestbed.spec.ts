import {ActivatedRouteStub} from '../../testing';
import {ExchangeAdapterRxComponent} from './exchange-adapter-rx.component';
import {ExchangeAdapter, NetworkConfig, ErrorCode, ErrorMessage} from '../model/exchange-adapter';
import {Observable} from 'rxjs/Observable';

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/**
 * Tests the behaviour of the Exchange Adapter (RxJS) component is as expected.
 * See: https://angular.io/docs/ts/latest/guide/reactive-forms.html
 *
 * Note use of Observables instead of Promises in the Exchange Adapter HTTP Data service calls.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Fix tests for RX form
 *
 * @author gazbert
 */
xdescribe('ExchangeAdapterRxComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeAdapterComponent: ExchangeAdapterRxComponent;

    let expectedExchangeAdapter: ExchangeAdapter;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: ErrorCode[];
    let expectedErrorMsgs: ErrorMessage[];

    let expectedUpdatedExchangeAdapter: ExchangeAdapter;

    let spyExchangeAdapterDataService: any;
    let router: any;

    let formBuilder: any;
    let exchangeDetailsForm: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e v2 API Adapter', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter',
            expectedNetworkConfig);

        expectedUpdatedExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e v3 API Adapter', 'com.gazbert.bxbot.adapter.NewBtceExchangeAdapter',
            expectedNetworkConfig);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        formBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
        exchangeDetailsForm = jasmine.createSpyObj('FormGroup', ['get']);

        formBuilder.group.and.returnValue(exchangeDetailsForm);
        exchangeDetailsForm.get.and.returnValue('btce');
        // TODO - think I need to mock out the rest of the bits here, e.g. nonFatalErrorHttpStatusCodes, nonFatalErrorMessages

        spyExchangeAdapterDataService = jasmine.createSpyObj('ExchangeAdapterHttpDataObservableService',
            ['getExchangeAdapterByExchangeId', 'update']);
        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.and.returnValue(Observable.of(expectedExchangeAdapter));
        spyExchangeAdapterDataService.update.and.returnValue(Observable.of(expectedUpdatedExchangeAdapter));

        exchangeAdapterComponent = new ExchangeAdapterRxComponent(spyExchangeAdapterDataService, <any> activatedRoute, formBuilder, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeAdapterDataService.getExchangeAdapterByExchangeId.calls.first().returnValue.subscribe(done);
    });

    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', () => {
        expect(exchangeAdapterComponent.exchangeAdapter).toBe(expectedExchangeAdapter);

        // paranoia ;-)
        expect(exchangeAdapterComponent.exchangeAdapter.id).toBe('btce');
        expect(exchangeAdapterComponent.exchangeAdapter.name).toBe('BTC-e v2 API Adapter');
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0].value).toBe(501);
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

    // FIXME - broken after changing to use Observables
    xit('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        exchangeAdapterComponent.save(true);
        spyExchangeAdapterDataService.update.calls.first().returnValue
            .then((updatedAdapter) => {
                expect(updatedAdapter).toBe(expectedUpdatedExchangeAdapter);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    // FIXME - broken after changing to use Observables
    xit('should create new Error Code when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorCode();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBeDefined();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1].value).toBeNull();
    });

    // FIXME - broken after changing to use Observables
    xit('should create new Error Message when user adds one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.addErrorMessage();
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1].value).toBe('');
    });

    // FIXME - broken after changing to use Observables
    xit('should remove Error Code when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorCode(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    // FIXME - broken after changing to use Observables
    xit('should remove Error Message when user deletes one', () => {
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
        exchangeAdapterComponent.deleteErrorMessage(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(exchangeAdapterComponent.exchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });
});
