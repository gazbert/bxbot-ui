import {ActivatedRouteStub} from "../../testing";
import {Exchange, NetworkConfig, ErrorCode, ErrorMessage} from "../model";
import {ExchangeAdapterRxComponent} from "./exchange-adapter-rx.component";

import {Observable} from 'rxjs/Observable';
// NOTE: We need to explicitly pull the rxjs operators in - if not, we get a stinky runtime error e.g.
// 'Failed: this.http.get(...).map is not a function'
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

/**
 * Tests the behaviour of the Exchange Adapter (RX) component is as expected.
 *
 * Note use of Observables instead of Promises in the Exchange HTTP service calls.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO rework tests for using Observable - jasmine spies need setting up...
 * TODO When should I/should I not use the testbed?
 * TODO Increase coverage for the form input + validation, adding/deleting error/message codes, etc...
 *
 * @author gazbert
 */
describe('ExchangeAdapterRxComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeAdapterComponent: ExchangeAdapterRxComponent;

    let expectedExchange: Exchange;
    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: ErrorCode[];
    let expectedErrorMsgs: ErrorMessage[];

    let spyExchangeDataService: any;
    let router: any;

    let formBuilder: any;
    let exchangeDetailsForm: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchange = new Exchange('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', expectedNetworkConfig, null);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchange.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        formBuilder = jasmine.createSpyObj('FormBuilder', ['group']);
        exchangeDetailsForm = jasmine.createSpyObj('FormGroup', ['get']);

        spyExchangeDataService = jasmine.createSpyObj('ExchangeHttpDataObservableService', ['getExchange', 'update']);

        // TODO rework for Observable
        //spyExchangeDataService.getExchange.and.returnValue(Promise.resolve(expectedExchange));
        spyExchangeDataService.getExchange.and.returnValue(Observable.of(expectedExchange));
        formBuilder.group.and.returnValue(exchangeDetailsForm);
        exchangeDetailsForm.get.and.returnValue('btce');

        spyExchangeDataService.update.and.returnValue(Promise.resolve(expectedExchange));

        exchangeAdapterComponent = new ExchangeAdapterRxComponent(spyExchangeDataService, <any> activatedRoute, formBuilder, router);
        exchangeAdapterComponent.ngOnInit();

        // TODO rework for Observable
        //spyExchangeDataService.getExchange.calls.first().returnValue.then(done);
        // spyExchangeDataService.getExchange.calls.first().returnValue.subscribe(done);
    });

    // TODO rework for Observable
    // it('should expose the Exchange retrieved from the service', () => {
    //     expect(exchangeAdapterComponent.exchange).toBe(expectedExchange);
    // });

    // TODO rework for Observable
    // it('should navigate when click Cancel', () => {
    //     exchangeAdapterComponent.goToDashboard();
    //     expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    // });

    // TODO rework for Observable
    // it('should save when click Save', () => {
    //     exchangeAdapterComponent.save();
    //     expect(spyExchangeDataService.update.calls.any()).toBe(true, 'ExchangeAdapterService.saveExchange called');
    //     expect(router.navigate.calls.any()).toBe(false, 'router.navigate not called yet');
    // });

    // TODO rework for Observable
    // it('should navigate when click Save resolves', done => {
    //     exchangeAdapterComponent.save();
    //
    //     // waits for async save to complete before navigating
    //     spyExchangeDataService.update.calls.first().returnValue
    //         .then(() => {
    //             expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
    //             done();
    //         });
    // });
});