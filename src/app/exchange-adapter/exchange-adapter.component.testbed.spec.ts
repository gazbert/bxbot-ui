import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http} from '@angular/http';
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../testing';
import {SharedModule} from "../shared/shared.module";
import {ExchangeAdapter, NetworkConfig} from '../model/exchange-adapter';
import {FakeExchangeAdapterDataPromiseService, SOME_FAKE_PROMISE_EXCHANGE_ADAPTERS} from '../model/exchange-adapter/testing';
import {ExchangeAdapterModule} from './exchange-adapter.module';
import {ExchangeAdapterComponent} from './exchange-adapter.component';
import {ExchangeAdapterDataPromiseService, ExchangeAdapterHttpDataPromiseService} from "../model/exchange-adapter/promise";

/**
 * Tests the behaviour of the Exchange Adapter component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests using the TestBed.
 *
 * Using TestBed seems to need a lot more code compared to using non-TestBed method. It also couples the test to the
 * UI elements, whereas the non-TestBed approach asserts the model directly.
 *
 * Code originated from here:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
let activatedRoute: ActivatedRouteStub;
let comp: ExchangeAdapterComponent;
let fixture: ComponentFixture<ExchangeAdapterComponent>;
let page: Page;

describe('ExchangeAdapterComponent tests using TestBed', () => {

    beforeEach(() => {
        activatedRoute = new ActivatedRouteStub();
    });

    describe('with overridden (stubbed) ExchangeAdapterService', overrideExchangeAdapterServiceSetup);
    describe('with fake ExchangeAdapterService setup', fakeExchangeAdapterServiceSetup);
});

/**
 * This test setup overrides ExchangeAdapterComponent ExchangeAdapterService provider with a
 * stubbed ExchangeAdapterService.
 */
function overrideExchangeAdapterServiceSetup() {

    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: number[];
    let expectedErrorMsgs: string[];
    let testExchangeAdapter: ExchangeAdapter;

    class StubExchangeAdapterHttpDataService implements ExchangeAdapterDataPromiseService {

        constructor() {
            expectedErrorCodes = [501];
            expectedErrorMsgs = ['Connection timeout'];
            expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
            testExchangeAdapter = new ExchangeAdapter('btce', 'BTC-e',
                'com.gazbert.bxbot.adapter.BtceExchangeAdapter', 1, expectedNetworkConfig);
        }

        getExchangeAdapterByBotId(id: number): Promise<ExchangeAdapter> {
            return Promise.resolve(true).then(() => Object.assign({}, testExchangeAdapter));
        }

        update(exchangeAdapter: ExchangeAdapter): Promise<ExchangeAdapter> {
            return Promise.resolve(true).then(() => Object.assign(testExchangeAdapter, exchangeAdapter));
        }

        getExchangeAdapters(): Promise<ExchangeAdapter[]> {
            return undefined;
        }
    }

    // The `id` value is irrelevant because it's ignored by service stub
    beforeEach(() => activatedRoute.testParams = {id: 1});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeAdapterModule, FormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: Router, useClass: RouterStub},

                // providing ExchangeAdapterHttpDataPromiseService at this level is irrelevant because
                // we use a stub just for testing stuff within out component.
                {provide: ExchangeAdapterHttpDataPromiseService, useValue: {}}
            ]
        })
        // Override component's own provider and use our stubbed ExchangeAdapterService
            .overrideComponent(ExchangeAdapterComponent, {
                set: {
                    providers: [
                        {provide: ExchangeAdapterHttpDataPromiseService, useClass: StubExchangeAdapterHttpDataService}
                    ]
                }
            })
            .compileComponents().then(() => {/*done*/
        });
    }));

    let stubExchangeAdapterDataService: StubExchangeAdapterHttpDataService;

    beforeEach(async(() => {
        createComponent().then(() => {/*done*/});

        // Get hold of component's injected ExchangeAdapterService stub.
        stubExchangeAdapterDataService = fixture.debugElement.injector.get(ExchangeAdapterHttpDataPromiseService);
    }));

    // xit('should inject the stubbed Exchange Adapter service',
    //     inject([ExchangeAdapterHttpDataPromiseService], (service: ExchangeAdapterHttpDataPromiseService) => {
    //         expect(service).toEqual({}, 'service injected from fixture');
    //         expect(stubExchangeAdapterDataService).toBeTruthy('service injected into component is the stub');
    //     }));

    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', () => {

        expect(page.adapterNameInput.value).toBe(testExchangeAdapter.name);
        expect(page.classNameInput.value).toBe(testExchangeAdapter.className);

        expect(page.connectionTimeoutInput.value).toBe('' + // hack to turn it into a String for comparison ;-)
            testExchangeAdapter.networkConfig.connectionTimeout);

        expect(page.errorCode_0Input.value).toBe('' + // hack to turn it into a String for comparison ;-)
            testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]);

        expect(page.errorMessage_0Input.value).toBe(
            testExchangeAdapter.networkConfig.nonFatalErrorMessages[0]);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', fakeAsync(() => {

        const origName = testExchangeAdapter.name;
        const newName = 'NewBTCe';

        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchangeAdapter.name).toBe(newName, 'Exchange Adapter Name updated');
        expect(testExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name unchanged before save');

        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchangeAdapter.name).toBe(newName,
            'ExchangeAdapterService Exchange Adapter Name changes after save');

        expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterService update() called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    }));

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        click(page.cancelBtn);
        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        const origName = testExchangeAdapter.name;
        const newName = '!NewBTCe'; // ! is invalid char

        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchangeAdapter.name).toBe(newName, 'Exchange Adapter Name updated');
        expect(testExchangeAdapter.name).toBe(origName,
            'ExchangeAdapterService Exchange Adapter Name unchanged before save');

        click(page.saveBtn);
        comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

        expect(testExchangeAdapter.name).toBe(origName,
            'ExchangeAdapterService Exchange Adapter Name not changed after save');

        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
        expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', () => {

        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);

        click(page.addNewErrorCodeLink);

        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeNull();
    });

    it('should create new Error Message when user adds one', () => {

        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);

        click(page.addNewErrorMessageLink);

        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBeDefined();
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe('');
    });

    it('should remove Error Code when user deletes one', () => {

        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);

        click(page.deleteErrorCodeBtn);

        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    it('should remove Error Message when user deletes one', () => {

        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);

        click(page.deleteErrorMessageBtn);

        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });
}

/**
 * This test setup uses a fake ExchangeAdapterService.
 */
const BITSTAMP = 0;
const firstExchangeAdapter = SOME_FAKE_PROMISE_EXCHANGE_ADAPTERS[BITSTAMP];
function fakeExchangeAdapterServiceSetup() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeAdapterModule, FormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeAdapterHttpDataPromiseService, useClass: FakeExchangeAdapterDataPromiseService},
                {provide: Router, useClass: RouterStub},

                // need this because the FakeExchangeAdapterDataPromiseService extends ExchangeAdapterHttpDataPromiseService
                {provide: Http, useValue: {}}
            ]
        })
            .compileComponents().then(() => {/*done*/});
    }));

    describe('when user navigates to existing Exchange Adapter', () => {

        let expectedExchangeAdapter: ExchangeAdapter;

        beforeEach(async(() => {
            expectedExchangeAdapter = firstExchangeAdapter;
            activatedRoute.testParams = {id: expectedExchangeAdapter.botId};
            createComponent().then(() => {/*done*/});
        }));

        it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', () => {

            expect(page.adapterNameInput.value).toBe(expectedExchangeAdapter.name);
            expect(page.classNameInput.value).toBe(expectedExchangeAdapter.className);

            expect(page.connectionTimeoutInput.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchangeAdapter.networkConfig.connectionTimeout);

            expect(page.errorCode_0Input.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]);

            expect(page.errorMessage_0Input.value).toBe(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[0]);
        });

        it('should save and navigate to Dashboard when user clicks Save for valid input', fakeAsync(() => {

            const origName = expectedExchangeAdapter.name;
            const newName = 'NewBitstamp';

            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchangeAdapter.name).toBe(newName, 'Exchange Adapter Name updated');
            expect(expectedExchangeAdapter.name).toBe(origName,
                'ExchangeAdapterService Exchange Adapter Name unchanged before save');

            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterService update() called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        }));

        it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
            click(page.cancelBtn);
            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        });

        it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
            const origName = expectedExchangeAdapter.name;
            const newName = '!NewBTCe'; // ! is invalid char

            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchangeAdapter.name).toBe(newName, 'Exchange Adapter Name updated');
            expect(expectedExchangeAdapter.name).toBe(origName,
                'ExchangeAdapterService Exchange Adapter Name unchanged before save');

            click(page.saveBtn);
            comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

            expect(expectedExchangeAdapter.name).toBe(origName,
                'ExchangeAdapterService Exchange Adapter Name not changed after save');

            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
            expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
        });

        it('should create new Error Code when user adds one', () => {

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);

            click(page.addNewErrorCodeLink);

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeDefined();
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeNull();
        });

        it('should remove Error Code when user deletes one', () => {

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);

            click(page.deleteErrorCodeBtn);

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).not.toBeDefined();
        });

        it('should create new Error Message when user adds one', () => {

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);

            click(page.addNewErrorMessageLink);

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(4);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).toBeDefined();
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).toBe('');
        });

        it('should remove Error Message when user deletes one', () => {

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(4);

            click(page.deleteErrorMessageBtn);

            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).not.toBeDefined();
        });
    });
}

// ----------------------------------------------------------------------------
// Test Helpers
// ----------------------------------------------------------------------------

/**
 * Creates the ExchangeAdapterComponent, initialize it, sets test variables.
 */
function createComponent() {

    fixture = TestBed.createComponent(ExchangeAdapterComponent);
    comp = fixture.componentInstance;
    page = new Page();

    // 1st change detection triggers ngOnInit which gets an Exchange Adapter config
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched Exchange Adapter config
        fixture.detectChanges();
        page.addPageElements();
    });
}

/**
 * This helper class represents the Exchange Adapter screen.
 */
class Page {

    navSpy: jasmine.Spy;
    saveSpy: jasmine.Spy;

    saveBtn: DebugElement;
    cancelBtn: DebugElement;

    addNewErrorCodeLink: DebugElement;
    addNewErrorMessageLink: DebugElement;

    deleteErrorCodeBtn: DebugElement;
    deleteErrorMessageBtn: DebugElement;

    adapterNameInput: HTMLInputElement;
    classNameInput: HTMLInputElement;
    connectionTimeoutInput: HTMLInputElement;
    errorCode_0Input: HTMLInputElement;
    errorMessage_0Input: HTMLInputElement;

    constructor() {
        // Use component's injector to see the services it injected.
        const compInjector = fixture.debugElement.injector;
        const exchangeAdapterDataService = compInjector.get(ExchangeAdapterHttpDataPromiseService);
        const router = compInjector.get(Router);

        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeAdapterDataService, 'update').and.callThrough();
    }

    addPageElements() {

        if (comp.exchangeAdapter) {

            // We have a Exchange Adapter so these elements are now in the DOM...
            this.saveBtn = fixture.debugElement.query(By.css('#exchangeAdapterSaveButton'));
            this.cancelBtn = fixture.debugElement.query(By.css('#exchangeAdapterCancelButton'));

            this.addNewErrorCodeLink = fixture.debugElement.query(By.css('#addNewErrorCodeLink'));
            this.addNewErrorMessageLink = fixture.debugElement.query(By.css('#addNewErrorMessageLink'));

            this.deleteErrorCodeBtn = fixture.debugElement.query(By.css('#deleteErrorCodeButton_0'));
            this.deleteErrorMessageBtn = fixture.debugElement.query(By.css('#deleteErrorMessageButton_0'));

            this.adapterNameInput = fixture.debugElement.query(By.css('#adapterName')).nativeElement;
            this.classNameInput = fixture.debugElement.query(By.css('#className')).nativeElement;
            this.connectionTimeoutInput = fixture.debugElement.query(By.css('#connectionTimeout')).nativeElement;
            this.errorCode_0Input = fixture.debugElement.query(By.css('#errorCode_0')).nativeElement;
            this.errorMessage_0Input = fixture.debugElement.query(By.css('#errorMessage_0')).nativeElement;
        }
    }
}
