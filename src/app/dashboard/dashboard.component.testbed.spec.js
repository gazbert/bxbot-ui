"use strict";
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var testing_1 = require("@angular/core/testing");
var Observable_1 = require("rxjs/Observable");
var dashboard_component_1 = require("./dashboard.component");
var dashboard_module_1 = require("./dashboard.module");
var testing_2 = require("../../testing");
var testing_3 = require("../model/bot/testing");
var bot_1 = require("../model/bot");
var fake_bot_data_observable_service_1 = require("../model/bot/testing/fake-bot-data-observable.service");
/**
 * Tests the behaviour of the Dashboard component is as expected.
 *
 * It uses the Angular TestBed and a stubbed FakeBotDataObservableService.
 *
 * I think I prefer the notestbed approach - less code and accessing just the model, i.e. no By.css stuff...
 * But, TestBed useful if you need to test the UI rendering?
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
var dashboardComponent;
var fixture;
var BITSTAMP_BOT = 0;
/**
 * Add our custom Jasmine matchers.
 */
beforeEach(testing_2.addMatchers);
/**
 * Add TestBed providers, compile, and create DashboardComponent.
 */
function compileAndCreate() {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [
                { provide: bot_1.BotHttpDataObservableService, useClass: testing_3.FakeBotDataObservableService },
                { provide: router_1.Router, useClass: RouterStub },
                { provide: http_1.Http, useValue: {} } // need this because the FakeBotDataObservableService extends
            ]
        }).compileComponents().then(function () {
            fixture = testing_1.TestBed.createComponent(dashboard_component_1.DashboardComponent);
            dashboardComponent = fixture.componentInstance;
        });
    }));
}
/**
 * Test Dashboard by via the bx-dashboard-item directive.
 */
describe('DashboardComponent tests with TestBed (shallow)', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [dashboard_component_1.DashboardComponent],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        });
    });
    compileAndCreate();
    tests(clickForShallow);
    function clickForShallow() {
        var dashboardItemElement = fixture.debugElement.query(platform_browser_1.By.css('bx-dashboard-item'));
        // Triggers event to select the first <bx-dashboard-item> DebugElement
        dashboardItemElement.triggerEventHandler('selected', fake_bot_data_observable_service_1.SOME_FAKE_OBSERVABLE_BOTS[BITSTAMP_BOT]);
    }
});
/**
 * Test Dashboard by accessing the div item class directly.
 */
describe('DashboardComponent tests with TestBed (deep)', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [dashboard_module_1.DashboardModule]
        });
    });
    compileAndCreate();
    tests(clickForDeep);
    function clickForDeep() {
        // clicks the first <div class='item'> DebugElement
        var dashboardItem = fixture.debugElement.query(platform_browser_1.By.css('.item'));
        testing_2.click(dashboardItem);
    }
});
/**
 * The (almost) same tests for both.
 * Only change: the way that the first Bot is clicked.
 */
function tests(botClick) {
    it('should NOT have Bot items before ngOnInit', function () {
        expect(dashboardComponent.bots).not.toBeDefined('should not have Bots items before ngOnInit called');
    });
    describe('After BotDataService getBots() Observable is subscribed to', function () {
        /*
         * Hack to prevent runtime test error:
         *
         * Failed: Cannot use setInterval from within an async zone test.
         * Error: Cannot use setInterval from within an async zone test.
         *
         * See: https://github.com/angular/angular/issues/10127
         */
        beforeAll(function () {
            // Monkey-patch Observable.debounceTime() since it is using
            // setInterval() internally which not allowed within async zone
            Observable_1.Observable.prototype.debounceTime = function () { return this; };
        });
        // Trigger component so it gets bots and binds to them the UI bits
        beforeEach(testing_1.async(function () {
            fixture.detectChanges(); // runs ngOnInit + ngAfterViewInit -> getBots()
            fixture.whenStable().then(function () { return fixture.detectChanges(); }); // bind to bots
        }));
        it('should have fetched 3 Bot items', function (done) {
            dashboardComponent.ngOnInit();
            dashboardComponent.bots.do(function (bots) {
                expect(bots.length).toBe(3, 'should have 3 Bot items after ngAfterViewInit');
                // paranoia!
                expect(bots[0].id).toBe(1);
                expect(bots[1].id).toBe(2);
                expect(bots[2].id).toBe(3);
                done();
            }).toPromise(); // MUST have this for test to work!
            dashboardComponent.ngAfterViewInit();
        });
        it('should display 3 Bot items', function () {
            // Find and examine the displayed bots
            // Look for them in the DOM by css class
            var bots = fixture.debugElement.queryAll(platform_browser_1.By.css('bx-dashboard-item'));
            expect(bots.length).toBe(3, 'should display 3 Bot items');
        });
        it('should tell Router to navigate when Bot item selected', 
        // inject our stubbed Router
        testing_1.inject([router_1.Router], function (router) {
            var spy = spyOn(router, 'navigateByUrl');
            // callback: trigger click on first inner <div class='item'> OR bx-dashboard-item triggerEventHandler
            botClick();
            // args passed to router.navigateByUrl()
            var navArgs = spy.calls.first().args[0];
            // expecting to navigate to id of the component's first Bot
            expect(navArgs).toBe('/bot/' + fake_bot_data_observable_service_1.SOME_FAKE_OBSERVABLE_BOTS[BITSTAMP_BOT].id, 'should nav to BotDetailsComponent for first Bot');
        }));
    });
}
var RouterStub = (function () {
    function RouterStub() {
    }
    RouterStub.prototype.navigateByUrl = function (url) {
        return url;
    };
    return RouterStub;
}());
//# sourceMappingURL=dashboard.component.testbed.spec.js.map