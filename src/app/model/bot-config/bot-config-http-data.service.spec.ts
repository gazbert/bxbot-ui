import {MockBackend, MockConnection} from '@angular/http/testing';
import {Http, HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {BotConfigHttpDataService as BotConfigDataService} from './bot-config-http-data.service';
import {BotConfig} from './bot-config.model';

/**
 * Tests the BotConfig HTTP Data service using a mocked HTTP backend.
 *
 * TODO - test non 200 OK responses etc from bxbot-ui-server - UI should handle scenario gracefully!
 *
 * @author gazbert
 */
describe('BotConfigHttpDataService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                BotConfigDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/
        });
    }));

    it('should instantiate implementation of BotConfigDataService service when injected',
        inject([BotConfigDataService], (service: BotConfigDataService) => {
            expect(service instanceof BotConfigDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new BotConfigDataService(http);
        expect(service instanceof BotConfigDataService).toBe(true,
            'new service should be instance of BotConfigDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getAllBotConfig() operation called', () => {

        let backend: MockBackend;
        let service: BotConfigDataService;
        let fakeBots: BotConfig[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotConfigDataService(http);
            fakeBots = makeBotConfigData();
            const options = new ResponseOptions({status: 200, body: {data: fakeBots}});
            response = new Response(options);
        }));

        it('should return 2 Bot Configs', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getAllBotConfig()
                .then(botConfigs => expect(botConfigs.length).toBe(2, 'should return 2 Bot Configs'));
        })));

        it('should handle returning no matching Bot Configs', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getAllBotConfig()
                .then(botConfigs => expect(botConfigs.length).toBe(0, 'should have no Bot Configs'));
        })));
    });
});

const makeBotConfigData = () => [
    new BotConfig('bitstamp-1', 'Bitstamp Bot', 'https://jakku.com/api/v1', 'rey', 'force'),
    new BotConfig('gdax-1', 'GDAX Bot', 'https://tatooine.com/api/v1', 'luke', 'podracer')
] as BotConfig[];
