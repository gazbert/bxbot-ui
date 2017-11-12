import {Router} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {FakeBotStatusDataService} from '../model/bot-status/testing';
import {BotStatus} from '../model/bot-status';
import {addMatchers} from '../../../testing/';

class FakeRouter {

    navigateByUrl(url: string) {
        return url;
    }

    navigate(url: string) {
        return url;
    }
}

/**
 * Tests the behaviour of the Dashboard component is as expected.
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
    let botStatusDataService: FakeBotStatusDataService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        botStatusDataService = new FakeBotStatusDataService(null);
        comp = new DashboardComponent(router, botStatusDataService);
    });

    it('should NOT have Bot items before calling ngOnInit', () => {
        expect(comp.bots).not.toBeDefined('should not have Bots items before ngOnInit called');
    });

    it('should have 3 Bot items after ngAfterViewInit', (done) => {
        comp.ngOnInit();
        comp.bots.subscribe((bots) => {
            expect(bots.length).toBe(3, 'should have 3 Bot items after ngAfterViewInit');

            // paranoia!
            expect(bots[0].id).toBe('bitstamp-1');
            expect(bots[1].id).toBe('gdax-2');
            expect(bots[2].id).toBe('gemini-3');

            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        comp.ngAfterViewInit();
    });

    // FIXME - test broken!
    xit('should have Gemini Bot item after user searches for \'ge\'', (done) => {
        comp.ngOnInit();
        comp.bots.subscribe((bots) => {
            expect(bots.length).toBe(1, 'should have 1 Gemini Bot item');
            expect(bots[0].id).toBe('gemini-3');
            expect(bots[0].name).toBe('Gemini');
            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        // comp.ngAfterViewInit();
        comp.search('ge');
    });

    it('should tell Router to navigate by BotId when Bot item selected', () => {
        const botStatus = new BotStatus('gdax-1', 'GDAX', 'Running');
        const spy = spyOn(router, 'navigateByUrl');
        comp.gotoBotDetails(botStatus);
        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/bot/gdax-1', 'should navigate to GDAX Bot Details for selected Bot');
    });
});

