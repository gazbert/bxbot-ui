"use strict";
var testing_1 = require("../../testing");
var bot_1 = require("../model/bot");
var bot_details_component_1 = require("./bot-details.component");
var Observable_1 = require("rxjs/Observable");
/**
 * Tests the behaviour of the Bot Details component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * @author gazbert
 */
describe('BotDetailsComponent tests without TestBed', function () {
    var activatedRoute;
    var botDetailsComponent;
    var expectedBot_1;
    var spyBotDataService;
    var router;
    beforeEach(function (done) {
        expectedBot_1 = new bot_1.Bot(1, 'Bitstamp', 'Running');
        activatedRoute = new testing_1.ActivatedRouteStub();
        activatedRoute.testParams = { id: expectedBot_1.id };
        router = jasmine.createSpyObj('router', ['navigate']);
        spyBotDataService = jasmine.createSpyObj('BotHttpDataObservableService', ['getBot']);
        spyBotDataService.getBot.and.returnValue(Observable_1.Observable.of(expectedBot_1));
        botDetailsComponent = new bot_details_component_1.BotDetailsComponent(spyBotDataService, activatedRoute);
        botDetailsComponent.ngOnInit();
        // OnInit calls BotDetailsComponent.getBot; wait for it to get the bot details
        botDetailsComponent.ngOnInit();
        spyBotDataService.getBot.calls.first().returnValue.subscribe(done); // tell the spy how to process Observable
    });
    it('should expose Bot Details retrieved from BotDataService', function () {
        expect(botDetailsComponent.bot).toBe(expectedBot_1);
        // paranoia ;-)
        expect(botDetailsComponent.bot.id).toBe(1);
        expect(botDetailsComponent.bot.name).toBe('Bitstamp');
        expect(botDetailsComponent.bot.status).toBe('Running');
    });
});
//# sourceMappingURL=bot-details-component-notestbed.spec.js.map