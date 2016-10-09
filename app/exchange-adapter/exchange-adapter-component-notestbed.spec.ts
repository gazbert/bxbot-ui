import {ActivatedRouteStub} from "../../testing";
import {Exchange, NetworkConfig, ErrorCode, ErrorMessage, ExchangeRestClientService} from "../shared";
import {ExchangeAdapterComponent} from "./exchange-adapter.component";

/**
 * First bash at writing Jasmine tests! ;-o
 *
 * Based off the goodies in the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO When should I/should I use the testbed?
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

    let spyExchangeRestClientService: any;
    let router: any;

    beforeEach(done => {

        expectedErrorCodes = [{'value': 501}];
        expectedErrorMsgs = [{'value': 'Connection timeout'}];
        expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);

        expectedExchange = new Exchange('btce', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', expectedNetworkConfig);
        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchange.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeRestClientService = jasmine.createSpyObj('ExchangeRestClientService', ['getExchange', 'update']);
        spyExchangeRestClientService.getExchange.and.returnValue(Promise.resolve(expectedExchange));
        spyExchangeRestClientService.update.and.returnValue(Promise.resolve(expectedExchange));

        exchangeAdapterComponent = new ExchangeAdapterComponent(spyExchangeRestClientService, <any> activatedRoute, router);
        exchangeAdapterComponent.ngOnInit();

        spyExchangeRestClientService.getExchange.calls.first().returnValue.then(done);
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
        expect(spyExchangeRestClientService.update.calls.any()).toBe(true, 'ExchangeRestClientService.save called');
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate not called yet');
    });

    it('should navigate when click Save resolves', done => {
        exchangeAdapterComponent.save();

        // waits for async save to complete before navigating
        spyExchangeRestClientService.update.calls.first().returnValue
            .then(() => {
                expect(router.navigate.calls.any()).toBe(true, 'router.navigate called');
                done();
            });
    });
});