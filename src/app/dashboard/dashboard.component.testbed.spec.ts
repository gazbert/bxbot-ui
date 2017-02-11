import {By} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {Http} from '@angular/http';
import {async, inject, ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardComponent} from './dashboard.component';
import {DashboardModule} from './dashboard.module';
import {addMatchers, click} from '../../testing';
import {FakeExchangeDataObservableService} from '../model/exchange/testing';
import {ExchangeHttpDataObservableService} from '../model/exchange';

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
        dashboardItemElement.triggerEventHandler('selected', dashboardComponent.exchanges[0]);
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

    // TODO - FIXME - broken after changing to use Observable
    xit('should NOT have Exchange items before ngOnInit', () => {
        expect(dashboardComponent.exchanges.length).toBe(0, 'should not have Exchange items before ngOnInit');
    });

    // TODO - FIXME - broken after changing to use Observable
    xit('should NOT have Exchange items immediately after ngOnInit', () => {
        fixture.detectChanges(); // runs initial lifecycle hooks
        expect(dashboardComponent.exchanges.length).toBe(0,
            'should not have Exchange items until ExchangeDataService promise resolves');
    });

    describe('After ExchangeDataService promise resolves', () => {

        // Trigger component so it gets exchanges and binds to them
        beforeEach(async(() => {
            fixture.detectChanges(); // runs ngOnInit -> getExchangesUsingPromise
            fixture.whenStable()     // No need for the `lastPromise` hack!
                .then(() => fixture.detectChanges()); // bind to exchanges
        }));

        it('should have retrieved 3 Exchange items', () => {
            expect(dashboardComponent.exchanges.length).toBe(3, 'should have retrieved 3 Exchange items');
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
                const id = dashboardComponent.exchanges[0].id;
                expect(navArgs).toBe('/exchange/' + id, 'should nav to ExchangeDetailsComponent for first Exchange');
            }));
    });
}

class RouterStub {
    navigateByUrl(url: string) {
        return url;
    }
}

