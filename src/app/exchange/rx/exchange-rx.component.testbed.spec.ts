import {async, ComponentFixture, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute, ActivatedRouteStub, click, newEvent, Router, RouterStub} from '../../../../testing';
import {FakeExchangeDataObservableService, SOME_FAKE_EXCHANGES} from '../../model/exchange/testing';
import {SharedModule} from '../../shared/shared.module';
import {
    Exchange,
    NetworkConfig,
    OptionalConfig,
    ExchangeDataObservableService,
    ExchangeHttpDataObservableService,
} from '../../model/exchange';
import {ExchangeModule} from '../exchange.module';
import {ExchangeRxComponent} from './exchange-rx.component';

/**
 * Tests the behaviour of the Exchange component (RxJS version) is as expected.
 *
 * Learning ground for writing Jasmine tests using the TestBed.
 * (Trying to write the equivalent tests for a Reactive form without the TestBed is proving VERY difficult!)
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
let comp: ExchangeRxComponent;
let fixture: ComponentFixture<ExchangeRxComponent>;
let page: Page;

describe('ExchangeRxComponent tests with TestBed', () => {

    beforeEach(() => {
        activatedRoute = new ActivatedRouteStub();
    });

    describe('with overridden (stubbed) ExchangeDataObservableService', overrideExchangeDataObservableServiceSetup);
    describe('with fake ExchangeDataObservableService setup', fakeExchangeDataObservableServiceSetup);
});

/**
 * This test setup overrides ExchangeRxComponent ExchangeDataObservableService provider with a
 * stubbed ExchangeDataObservableService.
 */
function overrideExchangeDataObservableServiceSetup() {

    let expectedNetworkConfig: NetworkConfig;
    let expectedErrorCodes: number[];
    let expectedErrorMsgs: string[];
    let expectedOptionalConfig: OptionalConfig;
    let testExchange: Exchange;

    class StubExchangeHttpDataService implements ExchangeDataObservableService {

        constructor() {
            expectedErrorCodes = [501, 502];
            expectedErrorMsgs = ['Connection timeout', 'Connection reset'];
            expectedNetworkConfig = new NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
            expectedOptionalConfig = new OptionalConfig([
                    {
                        name: 'buy-fee',
                        value: '0.2'
                    },
                    {
                        name: 'sell-fee',
                        value: '0.25'
                    }
                ]
            );

            testExchange = new Exchange('huobi', 'Huobi',
                'com.gazbert.bxbot.adapter.HuobiExchangeAdapter', expectedNetworkConfig, expectedOptionalConfig);
        }

        getExchangeByBotId(id: string): Observable<Exchange> {
            return Observable.create(observer => {
                observer.next(testExchange);
                // call complete if you want to close this stream (like a promise)
                observer.complete();
            });
        }

        updateExchange(exchange: Exchange): Observable<Exchange> {
            return Observable.create(observer => {
                observer.next(exchange);
                // call complete if you want to close this stream (like a promise)
                observer.complete();
            });
        }
    }

    // The `id` value is irrelevant because it's ignored by service stub
    beforeEach(() => activatedRoute.testParams = {id: 1});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeModule, ReactiveFormsModule, FormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: Router, useClass: RouterStub},

                // providing ExchangeHttpDataObservableService at this level is irrelevant because
                // we use a stub just for testing stuff within our component.
                {provide: ExchangeHttpDataObservableService, useValue: {}}
            ]
        })
        // Override component's own provider and use our stubbed ExchangeDataObservableService
            .overrideComponent(ExchangeRxComponent, {
                set: {
                    providers: [
                        {
                            provide: ExchangeHttpDataObservableService,
                            useClass: StubExchangeHttpDataService
                        }
                    ]
                }
            })
            .compileComponents().then(() => {/*done*/
        });
    }));

    let stubExchangeDataService: StubExchangeHttpDataService;

    beforeEach(async(() => {
        createComponent().then(() => {/*done*/
        });

        // Get hold of component's injected ExchangeDataObservableService stub.
        stubExchangeDataService = fixture.debugElement.injector.get(ExchangeHttpDataObservableService);
    }));

    it('should inject the stubbed Exchange service',
        inject([ExchangeHttpDataObservableService], (service: ExchangeHttpDataObservableService) => {
            expect(service).toBeDefined('service injected from fixture');
            expect(stubExchangeDataService).toBeTruthy('service injected into component is the stub');
    }));

    it('should expose Exchange config retrieved from ExchangeDataObservableService', () => {

        expect(page.exchangeNameInput.value).toBe(testExchange.name);
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

        page.exchangeNameInput.value = newName;
        page.exchangeNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchange.name).toBe(origName, 'Exchange model Name not to be updated before save');
        expect(testExchange.name).toBe(origName, 'Exchange Name NOT to be updated before save');

        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.name).toBe(newName, 'Exchange Name changes after save');

        expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeDataObservableService updateExchange() called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    }));

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        click(page.cancelBtn);
        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeDataObservableService updateExchange() not called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        const origName = testExchange.name;
        // ! is invalid char
        page.exchangeNameInput.value = '!NewHuobi';
        page.exchangeNameInput.dispatchEvent(newEvent('input')); // tell Angular

        expect(comp.exchange.name).toBe(origName, 'Exchange Name in model not to be updated');
        expect(testExchange.name).toBe(origName, 'Exchange Name unchanged before save');

        click(page.saveBtn);
        comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

        expect(testExchange.name).toBe(origName, 'Exchange Name not changed after save');

        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeDataObservableService updateExchange) not called');
        expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
    });

    it('should create new Error Code when user adds one', fakeAsync(() => {

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);

        click(page.addNewErrorCodeLink);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[2]).toBeDefined();
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[2]).toBeNaN();
    }));

    it('should remove Error Code when user deletes one', fakeAsync(() => {

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);

        click(page.deleteErrorCodeBtn);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        expect(testExchange.networkConfig.nonFatalErrorHttpStatusCodes[1]).not.toBeDefined();
    }));

    it('should create new Error Message when user adds one', fakeAsync(() => {

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(2);

        click(page.addNewErrorMessageLink);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(3);
        expect(testExchange.networkConfig.nonFatalErrorMessages[2]).toBeDefined();
        expect(testExchange.networkConfig.nonFatalErrorMessages[2]).toBe('');
    }));

    it('should remove Error Message when user deletes one', fakeAsync(() => {

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(2);

        click(page.deleteErrorMessageBtn);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.networkConfig.nonFatalErrorMessages.length).toBe(1);
        expect(testExchange.networkConfig.nonFatalErrorMessages[1]).not.toBeDefined();
    }));

    it('should create new Optional Config Item when user adds one', fakeAsync(() => {

        expect(testExchange.optionalConfig.configItems.length).toBe(2);

        click(page.addNewConfigItemLink);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.optionalConfig.configItems.length).toBe(3);
        expect(testExchange.optionalConfig.configItems[2].name).toBeDefined();
        expect(testExchange.optionalConfig.configItems[2].value).toBeDefined();
    }));

    it('should remove Optional Config Item when user deletes one', fakeAsync(() => {

        expect(testExchange.optionalConfig.configItems.length).toBe(2);

        click(page.deleteConfigItemBtn);
        click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        tick(); // wait for async save to complete

        expect(testExchange.optionalConfig.configItems.length).toBe(1);
        expect(testExchange.optionalConfig.configItems[1]).not.toBeDefined();
    }));
}

/**
 * This test setup uses a fake ExchangeDataObservableService.
 */
const BITSTAMP = 0;
const firstExchange = SOME_FAKE_EXCHANGES[BITSTAMP];

function fakeExchangeDataObservableServiceSetup() {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ExchangeModule, FormsModule, ReactiveFormsModule, SharedModule],
            providers: [
                {provide: ActivatedRoute, useValue: activatedRoute},
                {provide: ExchangeHttpDataObservableService, useClass: FakeExchangeDataObservableService},
                {provide: Router, useClass: RouterStub},

                // need this because the FakeExchangeDataObservableService extends ExchangeHttpDataObservableService
                {provide: Http, useValue: {}}
            ]
        })
            .compileComponents().then(() => {/*done*/
        });
    }));

    describe('when user navigates to existing Exchange', () => {

        let expectedExchange: Exchange;

        beforeEach(async(() => {
            expectedExchange = firstExchange;
            activatedRoute.testParams = {id: expectedExchange.id};
            createComponent().then(() => {/*done*/
            });
        }));

        it('should expose Exchange config retrieved from ExchangeDataObservableService', () => {

            expect(page.exchangeNameInput.value).toBe(expectedExchange.name);
            expect(page.classNameInput.value).toBe(expectedExchange.className);

            expect(page.connectionTimeoutInput.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchange.networkConfig.connectionTimeout);

            expect(page.errorCode_0Input.value).toBe('' + // hack to turn it into a String for comparison ;-)
                expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[0]);

            expect(page.errorMessage_0Input.value).toBe(expectedExchange.networkConfig.nonFatalErrorMessages[0]);
        });

        it('should save and navigate to Dashboard when user clicks Save for valid input', fakeAsync(() => {

            const origName = expectedExchange.name;
            const newName = 'NewBitstamp';

            page.exchangeNameInput.value = newName;
            page.exchangeNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchange.name).toBe(origName, 'Exchange Name not to be updated before save');
            expect(expectedExchange.name).toBe(origName, 'ExchangeDataObservableService Exchange Name unchanged before save');

            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(comp.exchange.name).toBe(newName, 'Exchange Name to be updated after save');
            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeDataObservableService updateExchange() called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        }));

        it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
            click(page.cancelBtn);
            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeDataObservableService updateExchange() not called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        });

        it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
            const origName = expectedExchange.name;
            const newName = '!NewHuobi'; // ! is invalid char

            page.exchangeNameInput.value = newName;
            page.exchangeNameInput.dispatchEvent(newEvent('input')); // tell Angular

            expect(comp.exchange.name).toBe(origName, 'Exchange Name updated');
            expect(expectedExchange.name).toBe(origName, 'ExchangeDataObservableService Exchange Name unchanged before save');

            click(page.saveBtn);
            comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?

            expect(expectedExchange.name).toBe(origName,
                'ExchangeDataObservableService Exchange Name not changed after save');

            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeDataObservableService updateExchange() not called');
            expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
        });

        it('should create new Error Code when user adds one', fakeAsync(() => {

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);

            click(page.addNewErrorCodeLink);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeDefined();
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeNaN();
        }));

        it('should remove Error Code when user deletes one', fakeAsync(() => {

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);

            click(page.deleteErrorCodeBtn);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
            expect(expectedExchange.networkConfig.nonFatalErrorHttpStatusCodes[3]).not.toBeDefined();
        }));

        it('should create new Error Message when user adds one', fakeAsync(() => {

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(3);

            click(page.addNewErrorMessageLink);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(4);
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).toBeDefined();
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).toBe('');
        }));

        it('should remove Error Message when user deletes one', fakeAsync(() => {

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(4);

            click(page.deleteErrorMessageBtn);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.networkConfig.nonFatalErrorMessages.length).toBe(3);
            expect(expectedExchange.networkConfig.nonFatalErrorMessages[3]).not.toBeDefined();
        }));

        it('should create new Optional Config Item when user adds one', fakeAsync(() => {

            expect(expectedExchange.optionalConfig.configItems.length).toBe(2);

            click(page.addNewConfigItemLink);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.optionalConfig.configItems.length).toBe(3);
            expect(expectedExchange.optionalConfig.configItems[2].name).toBeDefined();
            expect(expectedExchange.optionalConfig.configItems[2].value).toBe('');
        }));

        it('should remove Optional Config Item when user deletes one', fakeAsync(() => {

            expect(expectedExchange.optionalConfig.configItems.length).toBe(3);

            click(page.deleteConfigItemBtn);
            click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            tick(); // wait for async save to complete

            expect(expectedExchange.optionalConfig.configItems.length).toBe(2);
            expect(expectedExchange.optionalConfig.configItems[2]).not.toBeDefined();
        }));
    });
}

// ----------------------------------------------------------------------------
// Test Helpers
// ----------------------------------------------------------------------------

/**
 * Creates the ExchangeComponent, initialize it, sets test variables.
 */
function createComponent() {

    fixture = TestBed.createComponent(ExchangeRxComponent);
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

/**
 * This helper class represents the Exchange screen.
 */
class Page {

    navSpy: jasmine.Spy;
    saveSpy: jasmine.Spy;

    saveBtn: DebugElement;
    cancelBtn: DebugElement;

    addNewErrorCodeLink: DebugElement;
    deleteErrorCodeBtn: DebugElement;

    addNewErrorMessageLink: DebugElement;
    deleteErrorMessageBtn: DebugElement;

    addNewConfigItemLink: DebugElement;
    deleteConfigItemBtn: DebugElement;

    exchangeNameInput: HTMLInputElement;
    classNameInput: HTMLInputElement;
    connectionTimeoutInput: HTMLInputElement;

    errorCode_0Input: HTMLInputElement;
    errorMessage_0Input: HTMLInputElement;

    configItemName_0Input: HTMLInputElement;
    configItemValue_0Input: HTMLInputElement;

    constructor() {
        // Use component's injector to see the services it injected.
        const compInjector = fixture.debugElement.injector;
        const exchangeDataService = compInjector.get(ExchangeHttpDataObservableService);
        const router = compInjector.get(Router);

        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeDataService, 'updateExchange').and.callThrough();
    }

    addPageElements() {

        if (comp.exchange) {

            // We have a Exchange so these elements are now in the DOM...
            this.saveBtn = fixture.debugElement.query(By.css('#exchangeSaveButton'));
            this.cancelBtn = fixture.debugElement.query(By.css('#exchangeCancelButton'));

            this.addNewErrorCodeLink = fixture.debugElement.query(By.css('#addNewErrorCodeLink'));
            this.deleteErrorCodeBtn = fixture.debugElement.query(By.css('#deleteErrorCodeButton_0'));

            this.addNewErrorMessageLink = fixture.debugElement.query(By.css('#addNewErrorMessageLink'));
            this.deleteErrorMessageBtn = fixture.debugElement.query(By.css('#deleteErrorMessageButton_0'));

            this.addNewConfigItemLink = fixture.debugElement.query(By.css('#addNewExchangeConfigItemLink'));
            this.deleteConfigItemBtn = fixture.debugElement.query(By.css('#deleteExchangeConfigItemButton_0'));

            this.exchangeNameInput = fixture.debugElement.query(By.css('#exchangeName')).nativeElement;
            this.classNameInput = fixture.debugElement.query(By.css('#className')).nativeElement;
            this.connectionTimeoutInput = fixture.debugElement.query(By.css('#connectionTimeout')).nativeElement;
            this.errorCode_0Input = fixture.debugElement.query(By.css('#errorCode_0')).nativeElement;
            this.errorMessage_0Input = fixture.debugElement.query(By.css('#errorMessage_0')).nativeElement;

            this.configItemName_0Input = fixture.debugElement.query(By.css('#exchangeConfigItemName_0')).nativeElement;
            this.configItemValue_0Input = fixture.debugElement.query(By.css('#exchangeConfigItemValue_0')).nativeElement;
        }
    }
}
