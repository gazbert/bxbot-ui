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

    it('should NOT have Exchange items before calling ngOnInit', () => {
        expect(comp.exchanges).not.toBeDefined('should not have Exchanges items before ngOnInit called');
    });

    it('should have 3 Exchange items after ngAfterViewInit', (done) => {
        comp.ngOnInit();
        comp.exchanges.subscribe((exchanges) => {
            expect(exchanges.length).toBe(3, 'should have 3 Exchange items after ngAfterViewInit');

            // paranoia!
            expect(exchanges[0].id).toBe('bitstamp');
            expect(exchanges[1].id).toBe('gdax');
            expect(exchanges[2].id).toBe('gemini');

            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        comp.ngAfterViewInit();
    });

    // FIXME - search not working ;-/
    xit('should have Gemini Exchange item after user searches for \'ge\'', (done) => {
        comp.ngOnInit();
        comp.exchanges.subscribe((exchanges) => {
            expect(exchanges.length).toBe(1, 'should have 1 Gemini Exchange item');
            expect(exchanges[0].id).toBe('gemini');

            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        // comp.ngAfterViewInit();
        comp.search('ge');
    });

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
