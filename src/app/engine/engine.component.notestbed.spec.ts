import {ActivatedRouteStub} from '../../../testing';
import {EngineComponent} from './engine.component';
import {Engine} from '../model/engine';

/**
 * Tests the behaviour of the Engine component (Template version) is as expected.
 *
 * Learning ground for writing Jasmine tests without using the TestBed.
 *
 * I think I prefer not using the TestBed - less code to write, less API to lean, more intuitive using pure Jasmine,
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

    let spyEngineDataService: any;
    let router: any;

    beforeEach(done => {

        expectedEngine = new Engine('gdax-1', 'GDAX', 21, 'BTC', 0.7);
        expectedUpdatedEngine = new Engine('gdax-1', 'GDAX', 30, 'BTC', 0.4);

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedEngine.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyEngineDataService = jasmine.createSpyObj('EngineHttpDataPromiseService',
            ['getEngineByBotId', 'update']);
        spyEngineDataService.getEngineByBotId.and.returnValue(Promise.resolve(expectedEngine));
        spyEngineDataService.update.and.returnValue(Promise.resolve(expectedUpdatedEngine));

        engineComponent = new EngineComponent(spyEngineDataService, <any> activatedRoute, router);
        engineComponent.ngOnInit();

        spyEngineDataService.getEngineByBotId.calls.first().returnValue.then(done);
    });

    it('should expose Engine config retrieved from EngineDataService', () => {
        expect(engineComponent.engine).toBe(expectedEngine);

        // paranoia ;-)
        expect(engineComponent.engine.id).toBe('gdax-1');
        expect(engineComponent.engine.botName).toBe('GDAX');
        expect(engineComponent.engine.tradingCycleInterval).toBe(21);
        expect(engineComponent.engine.emergencyStopCurrency).toBe('BTC');
        expect(engineComponent.engine.emergencyStopBalance).toBe(0.7);
    });

    it('should save and navigate to Dashboard when user clicks Save for valid input', done => {
        engineComponent.save(true);
        spyEngineDataService.update.calls.first().returnValue
            .then((updatedEngine) => {
                expect(updatedEngine).toBe(expectedUpdatedEngine);
                expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
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
