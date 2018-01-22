import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient} from '@angular/common/http';
import {async, inject, TestBed} from '@angular/core/testing';
import {EngineHttpDataService as EngineDataService} from './engine-http-data.service';
import {Engine} from './engine.model';
import {BotConfigHttpDataService as BotConfigDataService} from "../bot-config";

/**
 * Tests the Engine HTTP Data service using a Mock HTTP backend.
 *
 * @author gazbert
 */
describe('EngineHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BotConfigDataService, EngineDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getEngineByBotId() operation called with \'gdax\'', () => {

        let backend: HttpTestingController;
        let service: EngineDataService;
        let engines: Engine[];
        const GDAX_BOT_INDEX = 0;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new EngineDataService(http);
            engines = makeEngineData();
        }));

        it('should return GDAX Engine', async(inject([], () => {

            service.getEngineByBotId('gdax')
                .then(response => {
                    expect(response).toBe(engines[GDAX_BOT_INDEX]);

                    // paranoia!
                    expect(response.botName).toEqual('GDAX');
                });

            backend.expectOne({
                url: 'app/engine?botId=gdax',
                method: 'GET'
            }).flush(engines, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no Engine', async(inject([], () => {

            service.getEngineByBotId('gdax-unknown')
                .then(engine => {
                    expect(engine).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/engine?botId=gdax-unknown',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when updateEngine() operation called for Bitstamp Engine', () => {

        let backend: HttpTestingController;
        let service: EngineDataService;
        let updatedEngine: Engine;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new EngineDataService(http);
            updatedEngine = new Engine('bitstamp', 'Bitstamp v2', 10, 'BTC', 1.54);
        }));

        it('should return updated Bitstamp Engine on success', async(inject([], () => {

            service.updateEngine('bitstamp', updatedEngine)
                .then(response => {
                    expect(response).toBe(updatedEngine);

                    // paranoia!
                    expect(response.botName).toBe('Bitstamp v2');
                });

            backend.expectOne({
                url: 'app/engine/bitstamp',
                method: 'PUT'
            }).flush(updatedEngine, {status: 200, statusText: 'Ok'});

        })));

        it('should NOT return Bot Engine for unknown engineId', async(inject([], () => {

            let unknownEngine = new Engine('unknown-id', 'Bitstamp v2', 10, 'BTC', 1.54);

            service.updateEngine('unknown-id', unknownEngine)
                .then(response => {
                    expect(response.botName).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/engine/unknown-id',
                method: 'PUT'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });
});

const makeEngineData = () => [
    new Engine('gdax', 'GDAX', 30, 'BTC', 0.54),
    new Engine('gemini', 'Gemini', 15, 'BTC', 1.54),
    new Engine('bitstamp', 'Bitstamp', 10, 'BTC', 2.54)
] as Engine[];

