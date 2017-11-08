import {ActivatedRouteStub} from '../../../testing';
import {EngineComponent} from './engine.component';
import {Engine} from '../model/engine';
import {BotStatus} from '../model/bot-status';

/**
 * Tests the behaviour of the Engine component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests without using the TestBed.
 *
 * I think I prefer not using the TestBed - less code to write, less API to learn, more intuitive using pure Jasmine,
 * and you're decoupled from UI changes by accessing the model directly.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * TODO - Increase coverage for form input + validation messages
 *
 * @author gazbert
 */
describe('EngineComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let engineComponent: EngineComponent;

    let expectedEngine: Engine;
    let expectedUpdatedEngine: Engine;
    let expectedBot: BotStatus;
    let expectedUpdatedBot: BotStatus;

    let spyEngineDataService: any;
    let spyBotStatusDataService: any;
    let router: any;

    beforeEach(done => {

        expectedEngine = new Engine('gdax-1', 'GDAX', 21, 'BTC', 0.7);
        expectedUpdatedEngine = new Engine('gdax-1', 'GDAX V2', 30, 'BTC', 0.4);
        expectedBot = new BotStatus('gdax-1', 'GDAX', 'Running');
        expectedUpdatedBot = new BotStatus('gdax-1', 'GDAX V2', 'Running');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedEngine.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyEngineDataService = jasmine.createSpyObj('EngineHttpDataService',
            ['getEngineByBotId', 'update']);
        spyEngineDataService.getEngineByBotId.and.returnValue(Promise.resolve(expectedEngine));
        spyEngineDataService.update.and.returnValue(Promise.resolve(expectedUpdatedEngine));

        spyBotStatusDataService = jasmine.createSpyObj('BotStatusHttpDataService', ['getBotStatusById', 'update']);
        spyBotStatusDataService.update.and.returnValue(Promise.resolve(expectedUpdatedEngine));

        engineComponent = new EngineComponent(spyEngineDataService, spyBotStatusDataService, <any> activatedRoute, router);
        engineComponent.ngOnInit();

        spyEngineDataService.getEngineByBotId.calls.first().returnValue.then(done);
    });

    it('should expose Engine config retrieved from EngineDataService', () => {
        expect(engineComponent.engine).toBe(expectedEngine);

        // paranoia ;-)
        expect(engineComponent.engine.id).toBe('gdax-1');
        expect(engineComponent.engine.botName).toBe('GDAX');
        expect(engineComponent.engine.tradeCycleInterval).toBe(21);
        expect(engineComponent.engine.emergencyStopCurrency).toBe('BTC');
        expect(engineComponent.engine.emergencyStopBalance).toBe(0.7);
    });

    // FIXME - test broken!
    xit('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        engineComponent.save(true);

        // FIXME - fix mess below
        // Need to assert the spyBotDataService.get and spyBotDataService.update called and route to dashboard happens!
        // spyEngineDataService.update.calls.first().returnValue
        //     .then((updatedEngine) => {
        //         expect(updatedEngine).toBe(expectedUpdatedEngine);
        //
        //         spyBotDataService.getBot.calls.first().returnValue
        //             .then((expectedBot) => {
        //                 expect(expectedBot).toBe(expectedBot);
        //
        //                 spyBotDataService.update.calls.first().returnValue
        //                     .then((updatedBot) => {
        //                         expect(updatedBot).toBe(expectedUpdatedBot);
        //
        //                         expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
        //                         done();
        //                     });
        //             });
        //     });

        spyEngineDataService.update.calls.first().returnValue
            .then((updatedEngine) => {
                expect(updatedEngine).toBe(expectedUpdatedEngine);
                // expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
                done();
            });
    });

    it('should NOT save and navigate to Dashboard when user clicks Cancel', () => {
        engineComponent.cancel();
        expect(spyEngineDataService.update.calls.any()).toEqual(false);
        expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    });

    it('should NOT save or navigate to Dashboard when user clicks Save for invalid input', () => {
        engineComponent.save(false);
        expect(spyEngineDataService.update.calls.any()).toEqual(false);
        expect(router.navigate.calls.any()).toBe(false, 'router.navigate should not have been called');
    });
});
