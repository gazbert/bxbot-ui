import {ActivatedRouteStub} from '../../../testing';
import {BotStatus} from '../model/bot-status';
import {BotDetailsComponent} from './bot-details.component';
import {Observable} from 'rxjs/Observable';

/**
 * Tests the behaviour of the Bot Details component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * @author gazbert
 */
describe('BotDetailsComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let botDetailsComponent: BotDetailsComponent;
    let expectedBot_1: BotStatus;
    let spyBotStatusDataService: any;
    let router: any;

    beforeEach(done => {

        expectedBot_1 = new BotStatus('bitstamp-1', 'Bitstamp', 'Running');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedBot_1.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyBotStatusDataService = jasmine.createSpyObj('BotStatusHttpDataService', ['getBotStatusById']);
        spyBotStatusDataService.getBotStatusById.and.returnValue(Observable.of(expectedBot_1));

        botDetailsComponent = new BotDetailsComponent(spyBotStatusDataService, <any> activatedRoute);
        botDetailsComponent.ngOnInit();

        // OnInit calls BotDetailsComponent.getBot; wait for it to get the bot details
        botDetailsComponent.ngOnInit();
        spyBotStatusDataService.getBotStatusById.calls.first().returnValue.subscribe(done); // tell the spy how to process Observable
    });

    it('should expose Bot Details retrieved from BotDataService', () => {
        expect(botDetailsComponent.bot).toBe(expectedBot_1);

        // paranoia ;-)
        expect(botDetailsComponent.bot.id).toBe('bitstamp-1');
        expect(botDetailsComponent.bot.name).toBe('Bitstamp');
        expect(botDetailsComponent.bot.status).toBe('Running');
    });
});

