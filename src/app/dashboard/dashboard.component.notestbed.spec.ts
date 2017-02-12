import {Router} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {addMatchers} from '../../testing';
import {FakeExchangeDataObservableService} from '../model/exchange/testing';
import {Exchange} from '../model/exchange';

/**
 * Tests the behaviour of the Trading Strategies component is as expected.
 *
 * It uses Fake/Dummy/Stubbed collaborators instead of Jasmine Spies for the
 * tests. I think I prefer the spy method - less boiler plate stub code to write.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Add test for search/getExchangeByName
 *
 * @author gazbert
 */
describe('DashboardComponent tests without TestBed', () => {

    let comp: DashboardComponent;
    let exchangeDataService: FakeExchangeDataObservableService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        exchangeDataService = new FakeExchangeDataObservableService(null);
        comp = new DashboardComponent(router, exchangeDataService);
    });

    // TODO - FIXME - broken after changing to use Observable
    // it('should NOT have Exchange items before calling OnInit', () => {
    //     expect(comp.exchanges.length).toBe(0, 'should not have Exchanges items before OnInit called');
    // });

    // TODO - FIXME - broken after changing to use Observable
    // xit('should NOT have Exchange items immediately after OnInit', () => {
    //     comp.ngOnInit(); // ngOnInit -> getExchangesPromise
    //     expect(comp.exchanges.length).toBe(0,
    //         'should not have Exchange items until after ExchangeDataService promise resolves');
    // });

    // TODO - FIXME - broken after changing to use Observable
    // it('should have 3 Exchange items after ExchangeDataService promise resolves', (done: DoneFn) => {
    //     comp.ngOnInit(); // ngOnInit -> getExchangesPromise
    //     exchangeDataService.lastPromise // the one from getExchangesPromise
    //         .then(() => {
    //             // throw new Error('deliberate error'); // see it fail gracefully
    //             expect(comp.exchanges.length).toBe(3, 'should have 3 Exchange items after ExchangeDataService promise resolves');
    //         })
    //         .then(done, done.fail);
    // });

    it('should tell Router to navigate by ExchangeId when Exchange item selected', () => {
        const testExchange = new Exchange('gdax', 'GDAX', 'Running');
        const spy = spyOn(router, 'navigateByUrl');
        comp.gotoExchangeDetails(testExchange);
        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/exchange/gdax', 'should navigate to GDAX Exchange Details for selected Exchange');
    });
});

class FakeRouter {

    navigateByUrl(url: string) {
        return url;
    }

    navigate(url: string) {
        return url;
    }
}
