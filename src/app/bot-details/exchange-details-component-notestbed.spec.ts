import {ActivatedRouteStub} from '../../testing';
import {Bot} from '../model/bot';
import {BotDetailsComponent} from './bot-details.component';

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
    let expectedBot_1: Bot;
    let spyBotDataService: any;
    let router: any;

    beforeEach(done => {

        expectedBot_1 = new Bot('bitstamp', 'Bitstamp', 'Running');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedBot_1.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyBotDataService = jasmine.createSpyObj('BotHttpDataPromiseService', ['getBot']);
        spyBotDataService.getBot.and.returnValue(Promise.resolve(expectedBot_1));

        botDetailsComponent = new BotDetailsComponent(spyBotDataService, <any> activatedRoute, router);
        botDetailsComponent.ngOnInit();

        // OnInit calls BotDetailsComponent.getBot; wait for it to get the bot details
        spyBotDataService.getBot.calls.first().returnValue.then(done);
    });

    it('should expose Bot Details retrieved from BotDataService', () => {
        expect(botDetailsComponent.bot).toBe(expectedBot_1);

        // paranoia ;-)
        expect(botDetailsComponent.bot.id).toBe('bitstamp');
        expect(botDetailsComponent.bot.name).toBe('Bitstamp');
        expect(botDetailsComponent.bot.status).toBe('Running');
    });
});

