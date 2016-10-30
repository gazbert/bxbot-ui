import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';
import {ExchangeAdapter, NetworkConfig, ErrorCode, ErrorMessage, ExchangeAdapterHttpDataPromiseService} from '../model/exchange-adapter';
import {FakeExchangeAdapterDataPromiseService, EXCHANGE_ADAPTERS} from '../model/exchange-adapter/testing';

import {ExchangeAdapterModule} from './exchange-adapter.module';
import {ExchangeAdapterComponent} from './exchange-adapter.component';
import {Http} from '@angular/http';

/**
 * Learning ground for writing jasmine tests.
 * Code originated from here: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO Increase coverage for the form input + validation, adding/deleting error/message codes, etc...
 *
 * @author gazbert
 */
// ----------------------------------------------------------------------------
// Test vars
// ----------------------------------------------------------------------------
let activatedRoute: ActivatedRouteStub;
let comp: ExchangeAdapterComponent;
let fixture: ComponentFixture<ExchangeAdapterComponent>;
let page: Page;

// ----------------------------------------------------------------------------
// Tests
// ----------------------------------------------------------------------------
describe('ExchangeAdapterComponent', () => {

    beforeEach(() => {
        activatedRoute = new ActivatedRouteStub();
    });

    // TODO is order of tests significant?
    describe('with ExchangeAdapterModule setup', exchangeAdapterModuleSetup);
    describe('when override its provided ExchangeAdapterHttpDataPromiseService', overrideSetup);
    describe('with FormsModule setup', formsModuleSetup);

    // describe('with SharedModule setup', sharedModuleSetup);
});

// ----------------------------------------------------------------------------
// Test overrides real ExchangeAdapterHttpDataPromiseService in ExchangeAdapterComponent with
// a stubbed service.
// ----------------------------------------------------------------------------
function overrideSetup() {

    class StubExchangeAdapterHttpDataService {

        expectedNetworkConfig: NetworkConfig;
        expectedErrorCodes: ErrorCode[];
        expectedErrorMsgs: ErrorMessage[];
        testExchangeAdapter: ExchangeAdapter;

        constructor() {
            this.expectedErrorCodes = [{'value': 501}];
            this.expectedErrorMsgs = [{'value': 'Connection timeout'}];
            this.expectedNetworkConfig = new NetworkConfig(60, this.expectedErrorCodes, this.expectedErrorMsgs);
            this.testExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter',
                this.expectedNetworkConfig);
        }

        getExchangeAdapterByExchangeId(id: string): Promise<ExchangeAdapter> {
            return Promise.resolve(true).then(() => Object.assign({}, this.testExchangeAdapter));
        }

        update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {
            return Promise.resolve(true).then(() => Object.assign(this.testExchangeAdapter, exchangeAdapter));
        }
    }

    // the `id` value is irrelevant because ignored by service stub
    beforeEach(() => activatedRoute.testParams = {id: 'btce-ignored-id'});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeAdapterModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: Router, useClass: RouterStub},
                // ExchangeAdapterHttpDataPromiseService at this level is IRRELEVANT!
                {provide: ExchangeAdapterHttpDataPromiseService, useValue: {}}
            ]
        })
        // Override component's own provider
            .overrideComponent(ExchangeAdapterComponent, {
                set: {
                    providers: [
                        {provide: ExchangeAdapterHttpDataPromiseService, useClass: StubExchangeAdapterHttpDataService}
                    ]
                }
            })
            .compileComponents();
    }));

    let stubExchangeAdapterDataService: StubExchangeAdapterHttpDataService;

    beforeEach(async(() => {
        createComponent();
        // get the component's injected StubExchangeHttpDataService
        stubExchangeAdapterDataService = fixture.debugElement.injector.get(ExchangeAdapterHttpDataPromiseService);
    }));

    it('should display stub Exchange Adapter\'s adapter name', () => {
        expect(page.adapterInput.value).toBe(stubExchangeAdapterDataService.testExchangeAdapter.adapter);
    });

    it('should save stub exchange change', fakeAsync(() => {

        const origName = stubExchangeAdapterDataService.testExchangeAdapter.adapter;
        const newName = 'com.gazbert.DifferentAdapterName';

        page.adapterInput.value = newName;
        page.adapterInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchangeAdapter.adapter).toBe(newName, 'component exchange adapter has new adapter');
        expect(stubExchangeAdapterDataService.testExchangeAdapter.adapter).toBe(origName, 'service exchange adapter unchanged before save');

        click(page.saveBtn);
        tick(); // wait for async save to complete
        expect(stubExchangeAdapterDataService.testExchangeAdapter.adapter).toBe(
            newName, 'service exchange adapter has new adapter name after save');
        expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('fixture injected service is not the component injected service',
        inject([ExchangeAdapterHttpDataPromiseService], (service: ExchangeAdapterHttpDataPromiseService) => {

            expect(service).toEqual({}, 'service injected from fixture');
            expect(stubExchangeAdapterDataService).toBeTruthy('service injected into component');
    }));
}

// ----------------------------------------------------------------------------
// Tests ExchangeAdapterModule using a fake ExchangeAdapterHttpDataPromiseService
// ----------------------------------------------------------------------------
const firstExchangeAdapter = EXCHANGE_ADAPTERS[0];

function exchangeAdapterModuleSetup() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeAdapterModule],
            //  declarations: [ ExchangeAdapterComponent ], // NO!  DOUBLE DECLARATION
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeAdapterHttpDataPromiseService, useClass: FakeExchangeAdapterDataPromiseService},
                {provide: Router, useClass: RouterStub},
                {provide: Http, useValue: {}} // need this because the FakeExchangeDataPromiseService extends ExchangeHttpDataPromiseService
            ]
        })
            .compileComponents();
    }));

    describe('when navigate to existing Exchange Adapter', () => {

        let expectedExchangeAdapter: ExchangeAdapter;

        beforeEach(async(() => {
            expectedExchangeAdapter = firstExchangeAdapter;
            activatedRoute.testParams = {id: expectedExchangeAdapter.id};
            createComponent();
        }));

        it('should display that exchange adapter\'s adapter', () => {
            expect(page.adapterInput.value).toBe(expectedExchangeAdapter.adapter);
        });

        it('should navigate when click cancel', () => {
            click(page.cancelBtn);
            expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
        });

        it('should save when click save but not navigate immediately', () => {
            click(page.saveBtn);
            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterHttpDataPromiseService.update called');
            expect(page.navSpy.calls.any()).toBe(false, 'router.navigate not called');
        });

        it('should navigate when click save and save resolves', fakeAsync(() => {
            click(page.saveBtn);
            tick(); // wait for async save to complete
            expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
        }));
    });

    // TODO FIX ME - bust
    // describe('when navigate with no exchange id', () => {
    //
    //     beforeEach(async(createComponent));
    //
    //     // it('should have exchange.id === Bitstamp', () => {
    //     //     expect(comp.exchange.adapter).toBe('Bitstamp');
    //     // });
    //
    //     // it('should display empty exchange adapter name', () => {
    //     //     expect(page.adapterInput.value).toBe('');
    //     // });
    // });

    // TODO what's the behaviour here? Back to dashboard
    // describe('when navigate to non-existant exchange id', () => {
    //
    //     beforeEach(async(() => {
    //         activatedRoute.testParams = {id: 'no-here'};
    //         createComponent();
    //     }));
    //
    //     it('should try to navigate back to dashboard list', () => {
    //         expect(page.gotoSpy.calls.any()).toBe(true, 'comp.gotoList called');
    //         expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    //     });
    // });

    // TODO FIX ME - does not throw exception
    // Why we must use `fixture.debugElement.injector` in `Page()`
    // it('cannot use `inject` to get component\'s provided ExchangeHttpDataService', () => {
    //
    //     let service: ExchangeHttpDataService;
    //     fixture = TestBed.createComponent(ExchangeAdapterComponent);
    //     expect(
    //         // Throws because `inject` only has access to TestBed's injector
    //         // which is an ancestor of the component's injector
    //         inject([ExchangeHttpDataService], (exchangeDataService: ExchangeHttpDataService) => service = exchangeDataService)
    //     )
    //         .toThrowError(/No provider for ExchangeHttpDataService/);
    //
    //     // get `ExchangeHttpDataService` with component's own injector
    //     service = fixture.debugElement.injector.get(ExchangeHttpDataService);
    //     expect(service).toBeDefined('debugElement.injector');
    // });
}

// ----------------------------------------------------------------------------
// TODO Do I need this?
// ----------------------------------------------------------------------------

function formsModuleSetup() {

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ExchangeAdapterComponent],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeAdapterHttpDataPromiseService, useClass: FakeExchangeAdapterDataPromiseService},
                {provide: Router, useClass: RouterStub},
                {provide: Http, useValue: {}} // need this because the FakeExchangeDataPromiseService extends ExchangeHttpDataPromiseService
            ]
        })
            .compileComponents();
    }));

    it('should display 1st exchange adapter\'s adapter name', fakeAsync(() => {
        const expectedExchangeAdapter = firstExchangeAdapter;
        activatedRoute.testParams = {id: expectedExchangeAdapter.id};
        createComponent().then(() => {
            expect(page.adapterInput.value).toBe(expectedExchangeAdapter.adapter);
        });
    }));
}

// ----------------------------------------------------------------------------
// TODO DO I need this?
// ----------------------------------------------------------------------------

// function sharedModuleSetup() {
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [SharedModule],
//             declarations: [ExchangeAdapterComponent],
//             providers: [
//                 {provide: ActivatedRoute, useValue: activatedRoute},
//                 {provide: ExchangeHttpDataService, useClass: FakeExchangeDataService},
//                 {provide: Router, useClass: RouterStub},
//             ]
//         })
//             .compileComponents();
//     }));
//
//     it('should display 1st exchange adapter\'s adapter name', fakeAsync(() => {
//         const expectedExchange = firstExchange;
//         activatedRoute.testParams = {id: expectedExchange.id};
//         createComponent().then(() => {
//             expect(page.adapterInput.value).toBe(expectedExchange.adapter);
//         });
//     }));
// }

// ----------------------------------------------------------------------------
// Test Helpers
// ----------------------------------------------------------------------------

/**
 * Create the ExchangeAdapterComponent, initialize it, set test variables.
 */
function createComponent() {

    fixture = TestBed.createComponent(ExchangeAdapterComponent);
    comp = fixture.componentInstance;
    page = new Page();

    // 1st change detection triggers ngOnInit which gets an exchange
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched exchange
        fixture.detectChanges();
        page.addPageElements();
    });
}

/**
 *
 */
class Page {

    gotoSpy: jasmine.Spy;
    navSpy: jasmine.Spy;
    saveSpy: jasmine.Spy;

    saveBtn: DebugElement;
    cancelBtn: DebugElement;
    // nameDisplay: HTMLElement;
    adapterInput: HTMLInputElement;

    constructor() {

        // Use component's injector to see the services it injected.
        const compInjector = fixture.debugElement.injector;
        const exchangeAdapterDataService = compInjector.get(ExchangeAdapterHttpDataPromiseService);
        const router = compInjector.get(Router);

        // this.gotoSpy = spyOn(comp, 'gotoList').and.callThrough();
        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeAdapterDataService, 'update').and.callThrough();
    }

    /**
     * Add page elements after exchange arrives
     *
     * TODO - setup the rest of the fields...
     */
    addPageElements() {

        if (comp.exchangeAdapter) {
            // have a exchange so these elements are now in the DOM
            const buttons = fixture.debugElement.queryAll(By.css('button'));
            this.cancelBtn = buttons[0];
            this.saveBtn = buttons[1];
            // this.nameDisplay = fixture.debugElement.query(By.css('adapter')).nativeElement;
            this.adapterInput = fixture.debugElement.query(By.css('#adapter')).nativeElement;
        }
    }
}
