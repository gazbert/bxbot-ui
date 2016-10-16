import {By} from "@angular/platform-browser";
import {DebugElement} from "@angular/core";
import {FormsModule} from "@angular/forms";

import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from "@angular/core/testing";
import {ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from "../../testing";

import {Exchange, NetworkConfig, ErrorCode, ErrorMessage} from "../model";
import {ExchangeAdapterModule} from "./exchange-adapter.module";
import {ExchangeAdapterService} from "./exchange-adapter.service";
import {ExchangeAdapterComponent} from "./exchange-adapter.component";
import {EXCHANGES} from "../model/test-exchange-adapters";
import {FakeExchangeAdapterDataService} from "../model/testing/fake-exchange-adapter-data.service";

/**
 * Learning ground for writing jasmine tests.
 *
 * Code originated from here: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO Increase coverage for the form input + validation, adding/deleting error/message codes, etc...
 *
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
    describe('when override its provided ExchangeAdapterService', overrideSetup);
    describe('with FormsModule setup', formsModuleSetup);
    // describe('with SharedModule setup', sharedModuleSetup);
});

// ----------------------------------------------------------------------------
// Test overrides real ExchangeAdapterService in ExchangeAdapterComponent with
// a stubbed service.
// ----------------------------------------------------------------------------
function overrideSetup() {

    class StubExchangeAdapterService {

        expectedNetworkConfig: NetworkConfig;
        expectedErrorCodes: ErrorCode[];
        expectedErrorMsgs: ErrorMessage[];
        testExchange: Exchange;

        constructor() {
            this.expectedErrorCodes = [{'value': 501}];
            this.expectedErrorMsgs = [{'value': 'Connection timeout'}];
            this.expectedNetworkConfig = new NetworkConfig(60, this.expectedErrorCodes, this.expectedErrorMsgs);
            this.testExchange = new Exchange('btce', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', this.expectedNetworkConfig);
        }

        getExchange(id: string): Promise<Exchange> {
            return Promise.resolve(true).then(() => Object.assign({}, this.testExchange));
        }

        saveExchange(exchange: Exchange): Promise<Exchange> {
            return Promise.resolve(true).then(() => Object.assign(this.testExchange, exchange));
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
                // ExchangeAdapterService at this level is IRRELEVANT!
                {provide: ExchangeAdapterService, useValue: {}}
            ]
        })
        // Override component's own provider
            .overrideComponent(ExchangeAdapterComponent, {
                set: {
                    providers: [
                        {provide: ExchangeAdapterService, useClass: StubExchangeAdapterService}
                    ]
                }
            })
            .compileComponents();
    }));

    let stubExchangeAdapterService: StubExchangeAdapterService;

    beforeEach(async(() => {
        createComponent();
        // get the component's injected StubExchangeAdapterService
        stubExchangeAdapterService = fixture.debugElement.injector.get(ExchangeAdapterService);
    }));

    it('should display stub Exchange Adapter\'s adapter name', () => {
        expect(page.adapterInput.value).toBe(stubExchangeAdapterService.testExchange.adapter);
    });

    it('should save stub exchange change', fakeAsync(() => {

        const origName = stubExchangeAdapterService.testExchange.adapter;
        const newName = 'com.gazbert.DifferentAdapterName';

        page.adapterInput.value = newName;
        page.adapterInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchange.adapter).toBe(newName, 'component exchange adapter has new adapter');
        expect(stubExchangeAdapterService.testExchange.adapter).toBe(origName, 'service exchange adapter unchanged before save');

        click(page.saveBtn);
        tick(); // wait for async save to complete
        expect(stubExchangeAdapterService.testExchange.adapter).toBe(newName, 'service exchange adapter has new adapter name after save');
        expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
    }));

    it('fixture injected service is not the component injected service',
        inject([ExchangeAdapterService], (service: ExchangeAdapterService) => {

            expect(service).toEqual({}, 'service injected from fixture');
            expect(stubExchangeAdapterService).toBeTruthy('service injected into component');
    }));
}

// ----------------------------------------------------------------------------
// Tests ExchangeAdapterModule using a fake ExchangeAdapterService
// ----------------------------------------------------------------------------
const firstExchange = EXCHANGES[0];

function exchangeAdapterModuleSetup() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeAdapterModule],
            //  declarations: [ ExchangeAdapterComponent ], // NO!  DOUBLE DECLARATION
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeAdapterService, useClass: FakeExchangeAdapterDataService},
                {provide: Router, useClass: RouterStub},
            ]
        })
            .compileComponents();
    }));

    describe('when navigate to existing exchange', () => {

        let expectedExchange: Exchange;

        beforeEach(async(() => {
            expectedExchange = firstExchange;
            activatedRoute.testParams = {id: expectedExchange.id};
            createComponent();
        }));

        it('should display that exchange adapter\'s adapter', () => {
            expect(page.adapterInput.value).toBe(expectedExchange.adapter);
        });

        it('should navigate when click cancel', () => {
            click(page.cancelBtn);
            expect(page.navSpy.calls.any()).toBe(true, 'router.navigate called');
        });

        it('should save when click save but not navigate immediately', () => {
            click(page.saveBtn);
            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterService.save called');
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
    // it('cannot use `inject` to get component\'s provided ExchangeAdapterService', () => {
    //
    //     let service: ExchangeAdapterService;
    //     fixture = TestBed.createComponent(ExchangeAdapterComponent);
    //     expect(
    //         // Throws because `inject` only has access to TestBed's injector
    //         // which is an ancestor of the component's injector
    //         inject([ExchangeAdapterService], (exchangeAdapterService: ExchangeAdapterService) => service = exchangeAdapterService)
    //     )
    //         .toThrowError(/No provider for ExchangeAdapterService/);
    //
    //     // get `ExchangeAdapterService` with component's own injector
    //     service = fixture.debugElement.injector.get(ExchangeAdapterService);
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
                {provide: ExchangeAdapterService, useClass: FakeExchangeAdapterDataService},
                {provide: Router, useClass: RouterStub},
            ]
        })
            .compileComponents();
    }));

    it('should display 1st exchange adapter\'s adapter name', fakeAsync(() => {
        const expectedExchange = firstExchange;
        activatedRoute.testParams = {id: expectedExchange.id};
        createComponent().then(() => {
            expect(page.adapterInput.value).toBe(expectedExchange.adapter);
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
//                 {provide: ExchangeAdapterService, useClass: FakeExchangeAdapterDataService},
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
        const exchangeAdapterService = compInjector.get(ExchangeAdapterService);
        const router = compInjector.get(Router);

        // this.gotoSpy = spyOn(comp, 'gotoList').and.callThrough();
        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeAdapterService, 'saveExchange').and.callThrough();
    }

    /**
     * Add page elements after exchange arrives
     *
     * TODO - setup the rest of the fields...
     */
    addPageElements() {

        if (comp.exchange) {
            // have a exchange so these elements are now in the DOM
            const buttons = fixture.debugElement.queryAll(By.css('button'));
            this.cancelBtn = buttons[0];
            this.saveBtn = buttons[1];
            // this.nameDisplay = fixture.debugElement.query(By.css('adapter')).nativeElement;
            this.adapterInput = fixture.debugElement.query(By.css('#adapter')).nativeElement;
        }
    }
}
