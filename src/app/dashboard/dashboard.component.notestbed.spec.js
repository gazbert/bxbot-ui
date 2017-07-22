"use strict";
var dashboard_component_1 = require("./dashboard.component");
var testing_1 = require("../../testing");
var testing_2 = require("../model/bot/testing");
var bot_1 = require("../model/bot");
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
describe('DashboardComponent tests without TestBed', function () {
    var comp;
    var botDataService;
    var router;
    beforeEach(function () {
        testing_1.addMatchers();
        router = new FakeRouter();
        botDataService = new testing_2.FakeBotDataObservableService(null);
        comp = new dashboard_component_1.DashboardComponent(router, botDataService);
    });
    it('should NOT have Bot items before calling ngOnInit', function () {
        expect(comp.bots).not.toBeDefined('should not have Bots items before ngOnInit called');
    });
    it('should have 3 Bot items after ngAfterViewInit', function (done) {
        comp.ngOnInit();
        comp.bots.subscribe(function (bots) {
            expect(bots.length).toBe(3, 'should have 3 Bot items after ngAfterViewInit');
            // paranoia!
            expect(bots[0].id).toBe(1);
            expect(bots[1].id).toBe(2);
            expect(bots[2].id).toBe(3);
            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        comp.ngAfterViewInit();
    });
    // FIXME - search not working ;-/
    xit('should have Gemini Bot item after user searches for \'ge\'', function (done) {
        comp.ngOnInit();
        comp.bots.subscribe(function (bots) {
            expect(bots.length).toBe(1, 'should have 1 Gemini Bot item');
            expect(bots[0].id).toBe('gemini');
            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        // comp.ngAfterViewInit();
        comp.search('ge');
    });
    it('should tell Router to navigate by BotId when Bot item selected', function () {
        var testBot = new bot_1.Bot(1, 'GDAX', 'Running');
        var spy = spyOn(router, 'navigateByUrl');
        comp.gotoBotDetails(testBot);
        var navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/bot/1', 'should navigate to GDAX Bot Details for selected Bot');
    });
});
var FakeRouter = (function () {
    function FakeRouter() {
    }
    FakeRouter.prototype.navigateByUrl = function (url) {
        return url;
    };
    FakeRouter.prototype.navigate = function (url) {
        return url;
    };
    return FakeRouter;
}());
//# sourceMappingURL=dashboard.component.notestbed.spec.js.map