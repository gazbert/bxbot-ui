import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Bot} from "./bot.model";
import {BotHttpDataPromiseService as BotDataService} from "./bot-http-data-promise.service";

/**
 * Tests the Bot HTTP Data Service (Promise flavour) using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                BotDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of BotDataService when injected',
        inject([BotDataService], (service: BotDataService) => {
            expect(service instanceof BotDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new BotDataService(http);
        expect(service instanceof BotDataService).toBe(true,
            'new service should be instance of BotDataService');
    }));

    it('should provide the MockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend backend should be provided');
        }));

    describe('when getBots() operation called', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            let options = new ResponseOptions({status: 200, body: {data: fakeBots}});
            response = new Response(options);
        }));

        it('should return 3 Bots ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBots()
                .then(bots => {
                    expect(bots.length).toBe(fakeBots.length,
                        'should have returned 3 Bots');

                    // paranoia!
                    expect(bots[0].id).toBe(1);
                    expect(bots[1].id).toBe(2);
                    expect(bots[2].id).toBe(3);
                });
        })));

        it('should handle returning no Bots', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBots()
                .then(bots => expect(bots.length).toBe(0, 'should have no Bots'));
        })));
    });

    describe('when getBot() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let fakeBots: Bot[];
        let response: Response;
        const GDAX_BOT = 1;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new BotDataService(http);
            fakeBots = makeBotData();
            let options = new ResponseOptions({status: 200, body: {data: fakeBots[GDAX_BOT]}});
            response = new Response(options);
        }));

        it('should return GDAX Bot ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getBot(2)
                .then(bots => {
                    expect(bots.id).toBe(2);
                    expect(bots.name).toBe('GDAX');
                    expect(bots.status).toBe('Running');
                });
        })));

        it('should handle returning no Bot', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getBot(100) // unknown id
                .then(bot => expect(bot.id).not.toBeDefined('should have no Bot'));
        })));
    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: MockBackend;
        let service: BotDataService;
        let response: Response;
        let udpatedBot: Bot;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {

            udpatedBot = new Bot(1, 'BitstampV2', 'Stopped');

            backend = be;
            service = new BotDataService(http);
            let options = new ResponseOptions({status: 200, body: {data: udpatedBot}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Bot on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update(udpatedBot)
                .then(bot => {
                    expect(bot.id).toBe(1);
                    expect(bot.name).toBe('BitstampV2');
                    expect(bot.status).toBe('Stopped');
                });
        })));

        it('should NOT return Bot for 401 response', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update(udpatedBot)
                .then(bot => expect(bot.id).not.toBeDefined('should not have Bot'));
        })));
    });
});

const makeBotData = () => [
    new Bot(1, 'Bitstamp', 'Running'),
    new Bot(2, 'GDAX', 'Running'),
    new Bot(3, 'Gemini', 'Stopped'),
] as Bot[];

