import {Router} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {addMatchers} from '../../testing';
import {FakeExchangeDataPromiseService} from '../model/exchange/testing';
import {Exchange} from '../model/exchange';

class FakeRouter {

    navigateByUrl(url: string) {
        return url;
    }

    navigate(url: string) {
        return url;
    }
}

/**
 * Learning ground for writing Jasmine tests.
 * Code originated from here: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
describe('DashboardComponent tests without TestBed', () => {

    let comp: DashboardComponent;
    let exchangeDataService: FakeExchangeDataPromiseService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        exchangeDataService = new FakeExchangeDataPromiseService(null);
        comp = new DashboardComponent(router, exchangeDataService);
    });

    it('should not have Exchange items before calling OnInit', () => {
        expect(comp.exchanges.length).toBe(0, 'should not have Exchanges items before OnInit');
    });

    it('should not have Exchange items immediately after OnInit', () => {
        comp.ngOnInit(); // ngOnInit -> getExchangesPromise
        expect(comp.exchanges.length).toBe(0, 'should not have Exchange items until ExchangeAdapterDataService promise resolves');
    });

    it('should have Exchange items after ExchangeAdapterDataService called', (done: DoneFn) => {
        comp.ngOnInit(); // ngOnInit -> getExchangesPromise
        exchangeDataService.lastPromise // the one from getExchangesPromise
            .then(() => {
                // throw new Error('deliberate error'); // see it fail gracefully
                expect(comp.exchanges.length).toBeGreaterThan(0,
                    'should have Exchange items after ExchangeAdapterDataService promise resolves');
            })
            .then(done, done.fail);
    });

    it('should tell Router to navigate by ExchangeId when Exchange item selected', () => {
        const testExchange = new Exchange('gdax', 'GDAX', 'Running');
        const spy = spyOn(router, 'navigateByUrl');
        comp.gotoExchangeDetails(testExchange);
        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/exchange/gdax', 'should nav to Exchange Details for Exchange GDAX');
    });
});
