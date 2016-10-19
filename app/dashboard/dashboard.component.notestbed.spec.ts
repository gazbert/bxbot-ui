import {Router} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {addMatchers} from "../../testing";
import {FakeExchangeDataService} from "../model/testing";
import {Exchange, NetworkConfig} from "../model/exchange.model";

class FakeRouter {

    navigateByUrl(url: string) {
        return url;
    }

    navigate(url: string) {
        return url;
    }
}

/**
 * Learning ground for writing jasmine tests.
 * Code originated from here: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
describe('When testing DashboardComponent without using Angular TestBed, it ', () => {

    let comp: DashboardComponent;
    let exchangeDataService: FakeExchangeDataService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        exchangeDataService = new FakeExchangeDataService(null);
        comp = new DashboardComponent(router, exchangeDataService);
    });

    it('should NOT have exchanges before calling OnInit', () => {
        expect(comp.exchanges.length).toBe(0,
            'should not have exchanges before OnInit');
    });

    it('should NOT have exchanges immediately after OnInit', () => {
        comp.ngOnInit(); // ngOnInit -> getExchangesPromise
        expect(comp.exchanges.length).toBe(0,
            'should not have exchanges until service promise resolves');
    });

    it('should HAVE exchanges after ExchangeAdapterDataService gets them', (done: DoneFn) => {
        comp.ngOnInit(); // ngOnInit -> getExchangesPromise
        exchangeDataService.lastPromise // the one from getExchangesPromise
            .then(() => {
                // throw new Error('deliberate error'); // see it fail gracefully
                expect(comp.exchanges.length).toBeGreaterThan(0,
                    'should have exchanges after service promise resolves');
            })
            .then(done, done.fail);
    });

    it('should tell ROUTER to navigate by exchange id', () => {

        const expectedErrorCodes = [{'value': 501}];
        const expectedErrorMsgs = [{'value': 'Connection timeout'}];
        const expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
        const testExchange = new Exchange('GDAX', 'com.gazbert.bxbot.adapter.GdaxExchangeAdapter', expectedNetworkConfig);

        const spy = spyOn(router, 'navigateByUrl');

        comp.gotoExchangeDetails(testExchange);

        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/exchange/GDAX', 'should nav to Exchange Details for Exchange GDAX');
    });
});