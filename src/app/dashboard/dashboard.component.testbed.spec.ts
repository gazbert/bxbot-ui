import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Http} from '@angular/http';
import {async, inject, ComponentFixture, TestBed} from '@angular/core/testing';
import {Observable} from 'rxjs/Observable';
import {DashboardComponent} from './dashboard.component';
import {DashboardModule} from './dashboard.module';
import {addMatchers, click} from '../../testing';
import {FakeExchangeDataObservableService} from '../model/exchange/testing';
import {ExchangeHttpDataObservableService} from '../model/exchange';
import {SOME_FAKE_OBSERVABLE_EXCHANGES} from "../model/exchange/testing/fake-exchange-data-observable.service";

/**
 * Tests the behaviour of the Trading Strategies component is as expected.
 *
 * It uses the Angular TestBed and a stubbed FakeExchangeDataObservableService.
 *
 * I think I prefer the notestbed approach - less code and accessing just the model, i.e. no By.css stuff...
 * But, TestBed useful if you need to test the UI rendering?
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
let dashboardComponent: DashboardComponent;
let fixture: ComponentFixture<DashboardComponent>;
const BITSTAMP_EXCHANGE = 0;

/**
 * Add our custom Jasmine matchers.
 */
beforeEach(addMatchers);

/**
 * Add TestBed providers, compile, and create DashboardComponent.
 */
function compileAndCreate() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                {provide: ExchangeHttpDataObservableService, useClass: FakeExchangeDataObservableService},
                {provide: Router, useClass: RouterStub},
                {provide: Http, useValue: {}} // need this because the FakeExchangeDataObservableService extends
                                              // ExchangeHttpDataObservableService
            ]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(DashboardComponent);
            dashboardComponent = fixture.componentInstance;
        });
    }));
}

/**
 * Test Dashboard by via the bx-dashboard-item directive.
 */
describe('DashboardComponent tests with TestBed (shallow)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent],
            schemas: [NO_ERRORS_SCHEMA]
        });
    });

    compileAndCreate();
    tests(clickForShallow);

    function clickForShallow() {
        const dashboardItemElement = fixture.debugElement.query(By.css('bx-dashboard-item'));
        // Triggers event to select the first <bx-dashboard-item> DebugElement
        dashboardItemElement.triggerEventHandler('selected', SOME_FAKE_OBSERVABLE_EXCHANGES[BITSTAMP_EXCHANGE]);
    }
});

/**
 * Test Dashboard by accessing the div item class directly.
 */
describe('DashboardComponent tests with TestBed (deep)', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [DashboardModule]
        });
    });

    compileAndCreate();
    tests(clickForDeep);

    function clickForDeep() {
        // clicks the first <div class='item'> DebugElement
        const dashboardItem = fixture.debugElement.query(By.css('.item'));
        click(dashboardItem);
    }
});

/**
 * The (almost) same tests for both.
 * Only change: the way that the first Exchange is clicked.
 */
function tests(exchangeClick: Function) {

    it('should NOT have Exchange items before ngOnInit', () => {
        expect(dashboardComponent.exchanges).not.toBeDefined('should not have Exchanges items before ngOnInit called');
    });

    describe('After ExchangeDataService getExchanges() Observable is subscribed to', () => {

        /*
         * Hack to prevent runtime test error:
         *
         * Failed: Cannot use setInterval from within an async zone test.
         * Error: Cannot use setInterval from within an async zone test.
         *
         * See: https://github.com/angular/angular/issues/10127
         */
        beforeAll(() => {
            // Monkey-patch Observable.debounceTime() since it is using
            // setInterval() internally which not allowed within async zone
            Observable.prototype.debounceTime = function () { return this; };
        });

        // Trigger component so it gets exchanges and binds to them the UI bits
        beforeEach(async(() => {
            fixture.detectChanges(); // runs ngOnInit + ngAfterViewInit -> getExchanges()
            fixture.whenStable().then(() => fixture.detectChanges()); // bind to exchanges
        }));

        it('should have fetched 3 Exchange items', (done) => {
            dashboardComponent.ngOnInit();
            dashboardComponent.exchanges.do((exchanges) => {

                expect(exchanges.length).toBe(3, 'should have 3 Exchange items after ngAfterViewInit');

                // paranoia!
                expect(exchanges[0].id).toBe('bitstamp');
                expect(exchanges[1].id).toBe('gdax');
                expect(exchanges[2].id).toBe('gemini');

                done();
            }).toPromise(); // MUST have this for test to work!
            dashboardComponent.ngAfterViewInit();
        });

        it('should display 3 Exchange items', () => {
            // Find and examine the displayed exchanges
            // Look for them in the DOM by css class
            const exchanges = fixture.debugElement.queryAll(By.css('bx-dashboard-item'));
            expect(exchanges.length).toBe(3, 'should display 3 Exchange items');
        });

        it('should tell Router to navigate when Exchange item selected',

            // inject our stubbed Router
            inject([Router], (router: Router) => {

                const spy = spyOn(router, 'navigateByUrl');

                // callback: trigger click on first inner <div class='item'> OR bx-dashboard-item triggerEventHandler
                exchangeClick();

                // args passed to router.navigateByUrl()
                const navArgs = spy.calls.first().args[0];

                // expecting to navigate to id of the component's first Exchange
                expect(navArgs).toBe('/exchange/' + SOME_FAKE_OBSERVABLE_EXCHANGES[BITSTAMP_EXCHANGE].id,
                    'should nav to ExchangeDetailsComponent for first Exchange');
            })
        );
    });
}

class RouterStub {
    navigateByUrl(url: string) {
        return url;
    }
}

