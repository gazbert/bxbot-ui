import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Http} from '@angular/http';
import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../../testing';
import {SharedModule} from '../shared/shared.module';
import {Exchange, NetworkConfig, ConfigItem, OptionalConfig} from '../model/exchange';
import {FakeExchangeDataPromiseService, SOME_FAKE_PROMISE_EXCHANGES} from '../model/exchange/testing';
import {ExchangeModule} from './exchange.module';
import {ExchangeComponent} from './exchange.component';
import {ExchangeDataPromiseService, ExchangeHttpDataPromiseService} from '../model/exchange/promise';

/**
 * Tests the behaviour of the Exchange component (Template version) is as expected.
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
let comp: ExchangeComponent;
let fixture: ComponentFixture<ExchangeComponent>;
let page: Page;

describe('ExchangeComponent tests using TestBed', () => {

    beforeEach(() => {
        activatedRoute = new ActivatedRouteStub();
    });

    describe('with overridden (stubbed) ExchangeDataPromiseService', overrideExchangeDataPromiseServiceSetup);
    describe('with fake ExchangeDataPromiseService setup', fakeExchangeDataPromiseServiceSetup);
});

/**
 * This test setup overrides ExchangeComponent ExchangeDataPromiseService provider with a
 * stubbed ExchangeDataPromiseService.
 */
function overrideExchangeDataPromiseServiceSetup() {

    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: number[];
    let expectedErrorMsgs: string[];

    let expectedBuyFeeConfigItem: ConfigItem;
    let expectedSellFeeConfigItem: ConfigItem;
    let expectedOptionalConfig: OptionalConfig;

    let testExchange: Exchange;

    class StubExchangeHttpDataService implements ExchangeDataPromiseService {

        constructor() {
            expectedErrorCodes = [501];
            expectedErrorMsgs = ['Connection timeout'];
            expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
            expectedBuyFeeConfigItem = new ConfigItem('buy-fee', '0.2');
            expectedSellFeeConfigItem = new ConfigItem('sell-fee', '0.25');
            expectedOptionalConfig = new OptionalConfig([expectedBuyFeeConfigItem, expectedSellFeeConfigItem]);

            testExchange = new Exchange('huobi', 'Huobi',
                'com.gazbert.bxbot.adapter.HuobiExchangeAdapter', expectedNetworkConfig, expectedOptionalConfig);
        }

        getExchangeByBotId(id: string): Promise<Exchange> {
            return Promise.resolve(true).then(() => Object.assign({}, testExchange));
        }

        updateExchange(exchange: Exchange): Promise<Exchange> {
            return Promise.resolve(true).then(() => Object.assign(testExchange, exchange));
        }
    }

    // The `id` value is irrelevant because it's ignored by service stub
    beforeEach(() => activatedRoute.testParams = {id: 1});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeModule, FormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: Router, useClass: RouterStub},

                // providing ExchangeHttpDataPromiseService at this level is irrelevant because
                // we use a stub just for testing stuff within out component.
                {provide: ExchangeHttpDataPromiseService, useValue: {}}
            ]
        })
        // Override component's own provider and use our stubbed StubExchangeHttpDataService
            .overrideComponent(ExchangeComponent, {
                set: {
                    providers: [
                        {provide: ExchangeHttpDataPromiseService, useClass: StubExchangeHttpDataService}
                    ]
                }
            })
            .compileComponents().then(() => {/*done*/
        });
    }));

    let stubExchangeDataService: StubExchangeHttpDataService;

    beforeEach(async(() => {
        createComponent().then(() => {/*done*/});

        // Get hold of component's injected ExchangeHttpDataPromiseService stub.
        stubExchangeDataService = fixture.debugElement.injector.get(ExchangeHttpDataPromiseService);
    }));

    it('should inject the stubbed Exchange service',
        inject([ExchangeHttpDataPromiseService], (service: ExchangeHttpDataPromiseService) => {
            expect(service).toBeDefined('service injected from fixture');
            expect(stubExchangeDataService).toBeTruthy('service injected into component is the stub');
    }));

    it('should expose Exchange config retrieved from ExchangeHttpDataPromiseService', () => {

        expect(page.adapterNameInput.value).toBe(testExchange.name);
        expect(page.classNameInput.value).toBe(testExchange.className);

        expect(page.connectionTimeoutInput.value).toBe('' + // hack to turn it into a String for comparison ;-)
            testExchange.networkConfig.connectionTimeout);

        expect(page.errorCode_0Input.value).toBe('' + // hack to turn it into a String for comparison ;-)
            testExchange.networkConfig.nonFatalErrorHttpStatusCodes[0]);

        expect(page.errorMessage_0Input.value).toBe(
            testExchange.networkConfig.nonFatalErrorMessages[0]);

        expect(page.configItemName_0Input.value).toBe(
            testExchange.optionalConfig.configItems[0].name);

        expect(page.configItemValue_0Input.value).toBe(
            testExchange.optionalConfig.configItems[0].value);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', fakeAsync(() => {

        const origName = testExchange.name;
        const newName = 'NewHuobi';

        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchange.name).toBe(newName, 'Exchange Name updated');
        expect(testExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name unchanged before save');

        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.name).toBe(newName, 'ExchangeHttpDataPromiseService Exchange Name changes after save');
        expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeHttpDataPromiseService updateExchange() called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    }));

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        click(page.cancelBtn);
        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeHttpDataPromiseService updateExchange() not called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        const origName = testExchange.name;
        const newName = '!NewHuobi'; // ! is invalid char

        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchange.name).toBe(newName, 'Exchange Name updated');
        expect(testExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name unchanged before save');

        click(page.saveBtn);
        comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

        expect(testExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name not changed after save');

        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeHttpDataPromiseService updateExchange() not called');
        expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', () => {

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);

        click(page.addNewErrorCodeLink);

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeNull();
    });

    it('should remove Error Code when user deletes one', () => {

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);

        click(page.deleteErrorCodeBtn);

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    });

    it('should create new Error Message when user adds one', () => {

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(1);

        click(page.addNewErrorMessageLink);

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(testExchange.networkConfig.nonFatalErrorMessages[1]).toBeDefined();
        expect(testExchange.networkConfig.nonFatalErrorMessages[1]).toBe('');
    });

    it('should remove Error Message when user deletes one', () => {

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(1);

        click(page.deleteErrorMessageBtn);

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(testExchange.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    });

    it('should create new Optional Config Item when user adds one', () => {

        expect(testExchange.optionalConfig.configItems.length).toBe(2);

        click(page.addNewConfigItemLink);

        expect(testExchange.optionalConfig.configItems.length).toBe(3);
        expect(testExchange.optionalConfig.configItems[2].name).toBe('');
        expect(testExchange.optionalConfig.configItems[2].value).toBe('');
    });

    it('should remove Optional Config Item when user deletes one', () => {

        expect(testExchange.optionalConfig.configItems.length).toBe(2);

        click(page.deleteConfigItemBtn);

        expect(testExchange.optionalConfig.configItems.length).toBe(1);
        expect(testExchange.optionalConfig.configItems[1]).not.toBeDefined();
    });
}

/**
 * This test setup uses a fake ExchangeHttpDataPromiseService.
 */
const BITSTAMP = 0;
const firstExchangeAdapter = SOME_FAKE_PROMISE_EXCHANGES[BITSTAMP];
function fakeExchangeDataPromiseServiceSetup() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeModule, FormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeHttpDataPromiseService, useClass: FakeExchangeDataPromiseService},
                {provide: Router, useClass: RouterStub},

                // need this because the FakeExchangeDataPromiseService extends ExchangeHttpDataPromiseService
                {provide: Http, useValue: {}}
            ]
        })
            .compileComponents().then(() => {/*done*/});
    }));

    describe('when user navigates to existing Exchange', () => {

        let expectedExchange: Exchange;

        beforeEach(async(() => {
            expectedExchange = firstExchangeAdapter;
            activatedRoute.testParams = {id: expectedExchange.id};
            createComponent().then(() => {/*done*/});
        }));

        it('should expose Exchange config retrieved from ExchangeHttpDataPromiseService', () => {

            expect(page.adapterNameInput.value).toBe(expectedExchange.name);
            expect(page.classNameInput.value).toBe(expectedExchange.className);

            expect(page.connectionTimeoutInput.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchange.networkConfig.connectionTimeout);

            expect(page.errorCode_0Input.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[0]);
            expect(page.errorMessage_0Input.value).toBe(expectedExchange.networkConfig.nonFatalErrorMessages[0]);

            expect(page.configItemName_0Input.value).toBe(expectedExchange.optionalConfig.configItems[0].name);
            expect(page.configItemValue_0Input.value).toBe(expectedExchange.optionalConfig.configItems[0].value);
        });

        it('should save and navigate to Dashboard when user clicks Save for valid input', fakeAsync(() => {

            const origName = expectedExchange.name;
            const newName = 'NewBitstamp';

            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchange.name).toBe(newName, 'Exchange Name updated');
            expect(expectedExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name unchanged before save');

            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete
            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeHttpDataPromiseService updateExchange() called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        }));

        it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
            click(page.cancelBtn);
            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeHttpDataPromiseService updateExchange() not called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        });

        it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
            const origName = expectedExchange.name;
            const newName = '!NewHuobi'; // ! is invalid char

            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchange.name).toBe(newName, 'Exchange Name updated');
            expect(expectedExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name unchanged before save');

            click(page.saveBtn);
            comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

            expect(expectedExchange.name).toBe(origName, 'ExchangeHttpDataPromiseService Exchange Name not changed after save');

            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeHttpDataPromiseService updateExchange() not called');
            expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
        });

        it('should create new Error Code when user adds one', () => {

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);

            click(page.addNewErrorCodeLink);

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeDefined();
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeNull();
        });

        it('should remove Error Code when user deletes one', () => {

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);

            click(page.deleteErrorCodeBtn);

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).not.toBeDefined();
        });

        it('should create new Error Message when user adds one', () => {

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(3);

            click(page.addNewErrorMessageLink);

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(4);
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).toBeDefined();
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).toBe('');
        });

        it('should remove Error Message when user deletes one', () => {

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(4);

            click(page.deleteErrorMessageBtn);

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(3);
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).not.toBeDefined();
        });

        it('should create new Optional Config Item when user adds one', () => {

            expect(expectedExchange.optionalConfig.configItems.length).toBe(2);

            click(page.addNewConfigItemLink);

            expect(expectedExchange.optionalConfig.configItems.length).toBe(3);
            expect(expectedExchange.optionalConfig.configItems[2].name).toBe('');
            expect(expectedExchange.optionalConfig.configItems[2].value).toBe('');
        });

        it('should remove Optional Config Item when user deletes one', () => {

            expect(expectedExchange.optionalConfig.configItems.length).toBe(3);

            click(page.deleteConfigItemBtn);

            expect(expectedExchange.optionalConfig.configItems.length).toBe(2);
            expect(expectedExchange.optionalConfig.configItems[2]).not.toBeDefined();
        });
    });
}

// ----------------------------------------------------------------------------
// Test Helpers
// ----------------------------------------------------------------------------

/**
 * This helper class represents the Exchange screen.
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

    addNewConfigItemLink: DebugElement;
    deleteConfigItemBtn: DebugElement;

    adapterNameInput: HTMLInputElement;
    classNameInput: HTMLInputElement;
    connectionTimeoutInput: HTMLInputElement;
    errorCode_0Input: HTMLInputElement;
    errorMessage_0Input: HTMLInputElement;

    configItemName_0Input: HTMLInputElement;
    configItemValue_0Input: HTMLInputElement;

    constructor() {
        // Use component's injector to see the services it injected.
        const compInjector = fixture.debugElement.injector;
        const exchangeAdapterDataService = compInjector.get(ExchangeHttpDataPromiseService);
        const router = compInjector.get(Router);

        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeAdapterDataService, 'updateExchange').and.callThrough();
    }

    addPageElements() {

        if (comp.exchange) {

            // We have a Exchange Adapter so these elements are now in the DOM...
            this.saveBtn = fixture.debugElement.query(By.css('#exchangeAdapterSaveButton'));
            this.cancelBtn = fixture.debugElement.query(By.css('#exchangeAdapterCancelButton'));

            this.addNewErrorCodeLink = fixture.debugElement.query(By.css('#addNewErrorCodeLink'));
            this.addNewErrorMessageLink = fixture.debugElement.query(By.css('#addNewErrorMessageLink'));

            this.deleteErrorCodeBtn = fixture.debugElement.query(By.css('#deleteErrorCodeButton_0'));
            this.deleteErrorMessageBtn = fixture.debugElement.query(By.css('#deleteErrorMessageButton_0'));

            this.addNewConfigItemLink = fixture.debugElement.query(By.css('#addNewExchangeConfigItemLink'));
            this.deleteConfigItemBtn = fixture.debugElement.query(By.css('#deleteExchangeConfigItemButton_0'));

            this.adapterNameInput = fixture.debugElement.query(By.css('#adapterName')).nativeElement;
            this.classNameInput = fixture.debugElement.query(By.css('#className')).nativeElement;
            this.connectionTimeoutInput = fixture.debugElement.query(By.css('#connectionTimeout')).nativeElement;
            this.errorCode_0Input = fixture.debugElement.query(By.css('#errorCode_0')).nativeElement;
            this.errorMessage_0Input = fixture.debugElement.query(By.css('#errorMessage_0')).nativeElement;

            this.configItemName_0Input = fixture.debugElement.query(By.css('#exchangeConfigItemName_0')).nativeElement;
            this.configItemValue_0Input = fixture.debugElement.query(By.css('#exchangeConfigItemValue_0')).nativeElement;
        }
    }
}

/**
 * Creates the ExchangeComponent, initialize it, sets test variables.
 */
function createComponent() {

    fixture = TestBed.createComponent(ExchangeComponent);
    comp = fixture.componentInstance;
    page = new Page();

    // 1st change detection triggers ngOnInit which gets an Exchange config
    fixture.detectChanges();
    return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched Exchange config
        fixture.detectChanges();
        page.addPageElements();
    });
}

