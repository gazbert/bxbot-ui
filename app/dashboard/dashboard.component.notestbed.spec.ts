import {Router} from "@angular/router";
import {DashboardComponent} from "./dashboard.component";
import {addMatchers} from "../../testing";
import {FakeExchangeDataPromiseService} from "../model/exchange/testing";
import {Exchange} from "../model/exchange";

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
    let exchangeDataService: FakeExchangeDataPromiseService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        exchangeDataService = new FakeExchangeDataPromiseService(null);
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

        const testExchange = new Exchange('gdax', 'GDAX', 'Running');
        const spy = spyOn(router, 'navigateByUrl');
        comp.gotoExchangeDetails(testExchange);
        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/exchange/gdax', 'should nav to Exchange Details for Exchange GDAX');
    });
});