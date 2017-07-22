"use strict";
var testing_1 = require("@angular/core/testing");
var forms_1 = require("@angular/forms");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var Observable_1 = require("rxjs/Observable");
var testing_2 = require("../../../testing");
var testing_3 = require("../../model/exchange-adapter/testing");
var shared_module_1 = require("../../shared/shared.module");
var exchange_adapter_1 = require("../../model/exchange-adapter");
var exchange_adapter_module_1 = require("../exchange-adapter.module");
var exchange_adapter_rx_component_1 = require("./exchange-adapter-rx.component");
/**
 * Tests the behaviour of the Exchange Adapter component (RxJS version) is as expected.
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
var activatedRoute;
var comp;
var fixture;
var page;
describe('ExchangeAdapterRxComponent tests with TestBed', function () {
    beforeEach(function () {
        activatedRoute = new testing_2.ActivatedRouteStub();
    });
    describe('with overridden (stubbed) ExchangeAdapterService', overrideExchangeAdapterServiceSetup);
    describe('with fake ExchangeAdapterService setup', fakeExchangeAdapterServiceSetup);
});
/**
 * This test setup overrides ExchangeAdapterRxComponent ExchangeAdapterService provider with a
 * stubbed ExchangeAdapterService.
 */
function overrideExchangeAdapterServiceSetup() {
    var expectedNetworkConfig;
    var expectedErrorCodes;
    var expectedErrorMsgs;
    var testExchangeAdapter;
    var StubExchangeAdapterHttpDataService = (function () {
        function StubExchangeAdapterHttpDataService() {
            expectedErrorCodes = [501];
            expectedErrorMsgs = ['Connection timeout'];
            expectedNetworkConfig = new exchange_adapter_1.NetworkConfig(60, expectedErrorCodes, expectedErrorMsgs);
            testExchangeAdapter = new exchange_adapter_1.ExchangeAdapter('btce', 'BTC-e', 'com.gazbert.bxbot.adapter.BtceExchangeAdapter', 1, expectedNetworkConfig);
        }
        StubExchangeAdapterHttpDataService.prototype.getExchangeAdapters = function () {
            return undefined;
        };
        StubExchangeAdapterHttpDataService.prototype.getExchangeAdapterByBotId = function (id) {
            return Observable_1.Observable.create(function (observer) {
                observer.next(testExchangeAdapter);
                // call complete if you want to close this stream (like a promise)
                observer.complete();
            });
        };
        StubExchangeAdapterHttpDataService.prototype.update = function (exchangeAdapter) {
            return Observable_1.Observable.create(function (observer) {
                observer.next(exchangeAdapter);
                // call complete if you want to close this stream (like a promise)
                observer.complete();
            });
        };
        return StubExchangeAdapterHttpDataService;
    }());
    // The `id` value is irrelevant because it's ignored by service stub
    beforeEach(function () { return activatedRoute.testParams = { id: 1 }; });
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [exchange_adapter_module_1.ExchangeAdapterModule, forms_1.ReactiveFormsModule, forms_1.FormsModule, shared_module_1.SharedModule],
            providers: [
                { provide: testing_2.ActivatedRoute, useValue: activatedRoute },
                { provide: testing_2.Router, useClass: testing_2.RouterStub },
                // providing ExchangeAdapterHttpDataObservableService at this level is irrelevant because
                // we use a stub just for testing stuff within out component.
                { provide: exchange_adapter_1.ExchangeAdapterHttpDataObservableService, useValue: {} }
            ]
        })
            .overrideComponent(exchange_adapter_rx_component_1.ExchangeAdapterRxComponent, {
            set: {
                providers: [
                    {
                        provide: exchange_adapter_1.ExchangeAdapterHttpDataObservableService,
                        useClass: StubExchangeAdapterHttpDataService
                    }
                ]
            }
        })
            .compileComponents().then(function () {
        });
    }));
    var stubExchangeAdapterDataService;
    beforeEach(testing_1.async(function () {
        createComponent().then(function () {
        });
        // Get hold of component's injected ExchangeAdapterService stub.
        stubExchangeAdapterDataService = fixture.debugElement.injector.get(exchange_adapter_1.ExchangeAdapterHttpDataObservableService);
    }));
    it('should inject the stubbed Exchange Adapter service', testing_1.inject([exchange_adapter_1.ExchangeAdapterHttpDataObservableService], function (service) {
        expect(service).toEqual({}, 'service injected from fixture');
        expect(stubExchangeAdapterDataService).toBeTruthy('service injected into component is the stub');
    }));
    it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', function () {
        expect(page.adapterNameInput.value).toBe(testExchangeAdapter.name);
        expect(page.classNameInput.value).toBe(testExchangeAdapter.className);
        expect(page.connectionTimeoutInput.value).toBe('' +
            testExchangeAdapter.networkConfig.connectionTimeout);
        expect(page.errorCode_0Input.value).toBe('' +
            testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]);
        expect(page.errorMessage_0Input.value).toBe(testExchangeAdapter.networkConfig.nonFatalErrorMessages[0]);
    });
    it('should save and navigate to Dashboard when user clicks Save for valid input', testing_1.fakeAsync(function () {
        var origName = testExchangeAdapter.name;
        var newName = 'NewBTCe';
        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(testing_2.newEvent('input')); // tell Angular
        expect(comp.exchangeAdapter.name).toBe(origName, 'Exchange Adapter Name model not to be updated before save');
        expect(testExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name model NOT to be updated before save');
        testing_2.click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        testing_1.tick(); // wait for async save to complete
        expect(testExchangeAdapter.name).toBe(newName, 'ExchangeAdapterService Exchange Adapter Name changes after save');
        expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterService update() called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    }));
    it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
        testing_2.click(page.cancelBtn);
        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
        expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
    });
    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
        var origName = testExchangeAdapter.name;
        var newName = '!NewBTCe'; // ! is invalid char
        page.adapterNameInput.value = newName;
        page.adapterNameInput.dispatchEvent(testing_2.newEvent('input')); // tell Angular
        expect(comp.exchangeAdapter.name).toBe(origName, 'Exchange Adapter Name in model not to be updated');
        expect(testExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name unchanged before save');
        testing_2.click(page.saveBtn);
        comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?
        expect(testExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name not changed after save');
        expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
        expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
    it('should create new Error Code when user adds one', testing_1.fakeAsync(function () {
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        testing_2.click(page.addNewErrorCodeLink);
        testing_2.click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        testing_1.tick(); // wait for async save to complete
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(2);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeDefined();
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[1]).toBeNaN();
    }));
    it('should create new Error Message when user adds one', testing_1.fakeAsync(function () {
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        testing_2.click(page.addNewErrorMessageLink);
        testing_2.click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        testing_1.tick(); // wait for async save to complete
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(2);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBeDefined();
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[1]).toBe('');
    }));
    // FIXME - TypeError: Cannot read property 'triggerEventHandler' of null
    xit('should remove Error Code when user deletes one', testing_1.fakeAsync(function () {
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(1);
        testing_2.click(page.deleteErrorCodeBtn);
        testing_2.click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        testing_1.tick(); // wait for async save to complete
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(0);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]).not.toBeDefined();
    }));
    it('should remove Error Message when user deletes one', testing_1.fakeAsync(function () {
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(1);
        testing_2.click(page.deleteErrorMessageBtn);
        testing_2.click(page.saveBtn);
        comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
        testing_1.tick(); // wait for async save to complete
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(0);
        expect(testExchangeAdapter.networkConfig.nonFatalErrorMessages[0]).not.toBeDefined();
    }));
}
/**
 * This test setup uses a fake ExchangeAdapterService.
 */
var BITSTAMP = 0;
var firstExchangeAdapter = testing_3.SOME_FAKE_OBSERVABLE_EXCHANGE_ADAPTERS[BITSTAMP];
function fakeExchangeAdapterServiceSetup() {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [exchange_adapter_module_1.ExchangeAdapterModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, shared_module_1.SharedModule],
            providers: [
                { provide: testing_2.ActivatedRoute, useValue: activatedRoute },
                { provide: exchange_adapter_1.ExchangeAdapterHttpDataObservableService, useClass: testing_3.FakeExchangeAdapterDataObservableService },
                { provide: testing_2.Router, useClass: testing_2.RouterStub },
                // need this because the FakeExchangeAdapterDataObservableService extends ExchangeAdapterHttpDataObservableService
                { provide: http_1.Http, useValue: {} }
            ]
        })
            .compileComponents().then(function () {
        });
    }));
    describe('when user navigates to existing Exchange Adapter', function () {
        var expectedExchangeAdapter;
        beforeEach(testing_1.async(function () {
            expectedExchangeAdapter = firstExchangeAdapter;
            activatedRoute.testParams = { id: expectedExchangeAdapter.botId };
            createComponent().then(function () {
            });
        }));
        it('should expose ExchangeAdapter config retrieved from ExchangeAdapterDataService', function () {
            expect(page.adapterNameInput.value).toBe(expectedExchangeAdapter.name);
            expect(page.classNameInput.value).toBe(expectedExchangeAdapter.className);
            expect(page.connectionTimeoutInput.value).toBe('' +
                expectedExchangeAdapter.networkConfig.connectionTimeout);
            expect(page.errorCode_0Input.value).toBe('' +
                expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[0]);
            expect(page.errorMessage_0Input.value).toBe(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[0]);
        });
        it('should save and navigate to Dashboard when user clicks Save for valid input', testing_1.fakeAsync(function () {
            var origName = expectedExchangeAdapter.name;
            var newName = 'NewBitstamp';
            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(testing_2.newEvent('input')); // tell Angular
            expect(comp.exchangeAdapter.name).toBe(origName, 'Exchange Adapter Name not to be updated before save');
            expect(expectedExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name unchanged before save');
            testing_2.click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            testing_1.tick(); // wait for async save to complete
            expect(comp.exchangeAdapter.name).toBe(newName, 'Exchange Adapter Name to be updated after save');
            expect(page.saveSpy.calls.any()).toBe(true, 'ExchangeAdapterService update() called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        }));
        it('should NOT save and navigate to Dashboard when user clicks Cancel', function () {
            testing_2.click(page.cancelBtn);
            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
            expect(page.navSpy).toHaveBeenCalledWith(['dashboard']);
        });
        it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', function () {
            var origName = expectedExchangeAdapter.name;
            var newName = '!NewBTCe'; // ! is invalid char
            page.adapterNameInput.value = newName;
            page.adapterNameInput.dispatchEvent(testing_2.newEvent('input')); // tell Angular
            expect(comp.exchangeAdapter.name).toBe(origName, 'Exchange Adapter Name updated');
            expect(expectedExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name unchanged before save');
            testing_2.click(page.saveBtn);
            comp.save(false); // TODO hack to tell Angular form is invalid - is there a better way?
            expect(expectedExchangeAdapter.name).toBe(origName, 'ExchangeAdapterService Exchange Adapter Name not changed after save');
            expect(page.saveSpy.calls.any()).toBe(false, 'ExchangeAdapterService update() not called');
            expect(page.navSpy.calls.any()).toBe(false, 'router.navigate should not have been called');
        });
        it('should create new Error Code when user adds one', testing_1.fakeAsync(function () {
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
            testing_2.click(page.addNewErrorCodeLink);
            testing_2.click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            testing_1.tick(); // wait for async save to complete
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeDefined();
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).toBeNaN();
        }));
        it('should remove Error Code when user deletes one', testing_1.fakeAsync(function () {
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(4);
            testing_2.click(page.deleteErrorCodeBtn);
            testing_2.click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            testing_1.tick(); // wait for async save to complete
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length).toBe(3);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes[3]).not.toBeDefined();
        }));
        it('should create new Error Message when user adds one', testing_1.fakeAsync(function () {
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);
            testing_2.click(page.addNewErrorMessageLink);
            testing_2.click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            testing_1.tick(); // wait for async save to complete
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(4);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).toBeDefined();
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).toBe('');
        }));
        it('should remove Error Message when user deletes one', testing_1.fakeAsync(function () {
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(4);
            testing_2.click(page.deleteErrorMessageBtn);
            testing_2.click(page.saveBtn);
            comp.save(true); // TODO hack to tell Angular form is valid - is there a better way?
            testing_1.tick(); // wait for async save to complete
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages.length).toBe(3);
            expect(expectedExchangeAdapter.networkConfig.nonFatalErrorMessages[3]).not.toBeDefined();
        }));
    });
}
// ----------------------------------------------------------------------------
// Test Helpers
// ----------------------------------------------------------------------------
/**
 * Creates the ExchangeAdapterComponent, initialize it, sets test variables.
 */
function createComponent() {
    fixture = testing_1.TestBed.createComponent(exchange_adapter_rx_component_1.ExchangeAdapterRxComponent);
    comp = fixture.componentInstance;
    page = new Page();
    // 1st change detection triggers ngOnInit which gets an Exchange Adapter config
    fixture.detectChanges();
    return fixture.whenStable().then(function () {
        // 2nd change detection displays the async-fetched Exchange Adapter config
        fixture.detectChanges();
        page.addPageElements();
    });
}
/**
 * This helper class represents the Exchange Adapter screen.
 */
var Page = (function () {
    function Page() {
        // Use component's injector to see the services it injected.
        var compInjector = fixture.debugElement.injector;
        var exchangeAdapterDataService = compInjector.get(exchange_adapter_1.ExchangeAdapterHttpDataObservableService);
        var router = compInjector.get(testing_2.Router);
        this.navSpy = spyOn(router, 'navigate');
        this.saveSpy = spyOn(exchangeAdapterDataService, 'update').and.callThrough();
    }
    Page.prototype.addPageElements = function () {
        if (comp.exchangeAdapter) {
            // We have a Exchange Adapter so these elements are now in the DOM...
            this.saveBtn = fixture.debugElement.query(platform_browser_1.By.css('#exchangeAdapterSaveButton'));
            this.cancelBtn = fixture.debugElement.query(platform_browser_1.By.css('#exchangeAdapterCancelButton'));
            this.addNewErrorCodeLink = fixture.debugElement.query(platform_browser_1.By.css('#addNewErrorCodeLink'));
            this.addNewErrorMessageLink = fixture.debugElement.query(platform_browser_1.By.css('#addNewErrorMessageLink'));
            this.deleteErrorCodeBtn = fixture.debugElement.query(platform_browser_1.By.css('#deleteErrorCodeButton_0'));
            this.deleteErrorMessageBtn = fixture.debugElement.query(platform_browser_1.By.css('#deleteErrorMessageButton_0'));
            this.adapterNameInput = fixture.debugElement.query(platform_browser_1.By.css('#adapterName')).nativeElement;
            this.classNameInput = fixture.debugElement.query(platform_browser_1.By.css('#className')).nativeElement;
            this.connectionTimeoutInput = fixture.debugElement.query(platform_browser_1.By.css('#connectionTimeout')).nativeElement;
            this.errorCode_0Input = fixture.debugElement.query(platform_browser_1.By.css('#errorCode_0')).nativeElement;
            this.errorMessage_0Input = fixture.debugElement.query(platform_browser_1.By.css('#errorMessage_0')).nativeElement;
        }
    };
    return Page;
}());
//# sourceMappingURL=exchange-adapter-rx.component.testbed.spec.js.map