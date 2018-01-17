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

    describe('when updateBotConfig() operation called for \'gdax-1\'', () => {

        let backend: MockBackend;
        let service: BotConfigDataService;
        let response: Response;
        let updatedBotConfig: BotConfig;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            updatedBotConfig = new BotConfig('gdax-1', 'GDAX Bot', 'https://tatooine.com/api/v1', 'luke', 'updatedPassword');

            backend = be;
            service = new BotConfigDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedBotConfig}});
            response = new Response(options);
        }));

        it('should return updated \'gdax-1\' BotConfig on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.updateBotConfig('gdax-1', updatedBotConfig)
                .then(botConfig => {
                    expect(botConfig).toBe(updatedBotConfig);

                    // paranoia!
                    expect(botConfig.id).toBe(updatedBotConfig.id);
                    expect(botConfig.alias).toBe(updatedBotConfig.alias);
                    expect(botConfig.baseUrl).toBe(updatedBotConfig.baseUrl);
                    expect(botConfig.username).toBe(updatedBotConfig.username);
                    expect(botConfig.password).toBe(updatedBotConfig.password);
                });
        })));

        it('should NOT return BotConfig for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.updateBotConfig('gdax-not-known', updatedBotConfig)
                .then(botConfig => expect(botConfig.id).not.toBeDefined('should have no BotConfig'));
        })));
    });

    describe('when deleteBotConfigById() operation called with \'gdax-1\'', () => {

        let backend: MockBackend;
        let service: BotConfigDataService;
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotConfigDataService(http);
            const options = new ResponseOptions({status: 200});
            response = new Response(options);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.deleteBotConfigById('gdax-1')
                .then(status => expect(status).toBe(true));
        })));

        it('should return status response of \'false\' if NOT successful', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.deleteBotConfigById('gdax-1-not-known')
                .then(status => expect(status).toBe(false));
        })));
    });
});

const makeBotConfigData = () => [
    new BotConfig('bitstamp-1', 'Bitstamp Bot', 'https://jakku.com/api/v1', 'rey', 'force'),
    new BotConfig('gdax-1', 'GDAX Bot', 'https://tatooine.com/api/v1', 'luke', 'podracer')
] as BotConfig[];
