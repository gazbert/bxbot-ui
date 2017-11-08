import {MockBackend, MockConnection} from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from '@angular/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {EngineHttpDataService as EngineDataService} from './engine-http-data.service';
import {Engine} from './engine.model';

/**
 * Tests the Engine HTTP Data service using a Mock HTTP backend.
 *§
 * TODO - test non 200 OK responses etc from bxbot-ui-server - UI should handle scenario gracefully!
 *
 * @author gazbert
 */
describe('EngineHttpDataService tests using TestBed + Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                EngineDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        }).compileComponents().then(() => {/*done*/});
    }));

    it('should instantiate implementation of EngineDataService when injected',
        inject([EngineDataService], (service: EngineDataService) => {
            expect(service instanceof EngineDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        const service = new EngineDataService(http);
        expect(service instanceof EngineDataService).toBe(true,
            'new service should be instance of EngineDataService');
    }));

    it('should provide MockBackend as replacement for XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('MockBackend should be provided');
    }));

    describe('when getEngineByBotId() operation called with \'gdax\'', () => {

        let backend: MockBackend;
        let service: EngineDataService;
        let fakeEngines: Engine[];
        let response: Response;
        const GDAX_BOT_INDEX = 0;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
            backend = mockBackend;
            service = new EngineDataService(http);
            fakeEngines = makeEngineData();
            const options = new ResponseOptions({status: 200, body: {data: fakeEngines[GDAX_BOT_INDEX]}});
            response = new Response(options);
        }));

        it('should return GDAX Engine', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getEngineByBotId('gdax')
                .then(engine => {
                    expect(engine.id).toBe('gdax');
                    expect(engine.botName).toBe('GDAX');
                    expect(engine.tradeCycleInterval).toBe(30);
                    expect(engine.emergencyStopCurrency).toBe('BTC');
                    expect(engine.emergencyStopBalance).toBe(0.54);
                });
        })));

        it('should handle returning no Engine', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getEngineByBotId('unknown')
                .then(engine => expect(engine).not.toBeDefined('should have no Engine'));
        })));
    });

    describe('when update() operation called for Bitstamp Engine', () => {

        let backend: MockBackend;
        let service: EngineDataService;
        let response: Response;
        let updatedEngine: Engine;

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
            updatedEngine = new Engine('bitstamp', 'Bitstamp v2', 10, 'BTC', 1.54);
            backend = mockBackend;
            service = new EngineDataService(http);
            const options = new ResponseOptions({status: 200, body: {data: updatedEngine}});
            response = new Response(options);
        }));

        it('should return updated Bitstamp Engine on success', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.update('bitstamp', updatedEngine)
                .then(engine => {
                    expect(engine).toBe(updatedEngine);

                    // paranoia!
                    expect(engine.id).toBe('bitstamp');
                    expect(engine.botName).toBe('Bitstamp v2');
                    expect(engine.tradeCycleInterval).toBe(10);
                    expect(engine.emergencyStopCurrency).toBe('BTC');
                    expect(engine.emergencyStopBalance).toBe(1.54);

                });
        })));

        it('should NOT return Bot Engine for 401 response', async(inject([], () => {
            const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.update('unknownBotId', updatedEngine)
                .then(engine => expect(engine.id).not.toBeDefined('should have no Engine'));
        })));
    });
});

const makeEngineData = () => [
    new Engine('gdax', 'GDAX', 30, 'BTC', 0.54),
    new Engine('gemini', 'Gemini', 15, 'BTC', 1.54),
    new Engine('bitstamp', 'Bitstamp', 10, 'BTC', 2.54)
] as Engine[];

