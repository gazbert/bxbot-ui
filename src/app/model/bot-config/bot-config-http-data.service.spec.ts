import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {BotConfigHttpDataService as BotConfigDataService} from './bot-config-http-data.service';
import {BotConfig} from './bot-config.model';

/**
 * Tests the BotConfig HTTP Data service using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotConfigHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BotConfigDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getAllBotConfig() operation called', () => {

        let backend: HttpTestingController;
        let service: BotConfigDataService;
        let botConfigs: BotConfig[];

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotConfigDataService(http);
            botConfigs = makeBotConfigData();
        }));

        it('should return all Bot Configs on success', async(inject([], () => {

            service.getAllBotConfig()
                .then(response => {
                    expect(response).toBe(botConfigs);
                });

            backend.expectOne({
                url: 'app/bots',
                method: 'GET'
            }).flush(botConfigs, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no Bot Configs', async(inject([], () => {

            service.getAllBotConfig()
                .then(response => {
                    expect(response).toEqual([]);
                });

            backend.expectOne({
                url: 'app/bots',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when updateBotConfig() operation called for \'gdax-1\'', () => {

        let backend: HttpTestingController;
        let service: BotConfigDataService;
        let updatedBotConfig: BotConfig;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotConfigDataService(http);
            updatedBotConfig = new BotConfig('gdax-1', 'GDAX Bot', 'https://tatooine.com/api/v1', 'luke', 'updatedPassword');
        }));

        it('should return updated BotConfig on success', async(inject([], () => {

            service.updateBotConfig('gdax-1', updatedBotConfig)
                .then(response => {
                    expect(response).toBe(updatedBotConfig);

                    // paranoia!
                    expect(response.id).toBe(updatedBotConfig.id);
                    expect(response.alias).toBe(updatedBotConfig.alias);
                    expect(response.baseUrl).toBe(updatedBotConfig.baseUrl);
                    expect(response.username).toBe(updatedBotConfig.username);
                    expect(response.password).toBe(updatedBotConfig.password);
                });

            backend.expectOne({
                url: 'app/bots/gdax-1',
                method: 'PUT'
            }).flush(updatedBotConfig, {status: 200, statusText: 'Ok'});

        })));

        it('should not return BotConfig for unknown botId', async(inject([], () => {

            service.updateBotConfig('unknown-bot-id', updatedBotConfig)
                .then(response => {
                    expect(response.id).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/bots/unknown-bot-id',
                method: 'PUT'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });

    xdescribe('when deleteBotConfigById() operation called with \'gdax-1\'', () => {

        let backend: HttpTestingController;
        let service: BotConfigDataService;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotConfigDataService(http);
        }));

        it('should return status response of \'true\' if successful', async(inject([], () => {

            service.deleteBotConfigById('gdax-1')
                .then(response => {
                    expect(response).toBe(true);
                });

            backend.expectOne({
                url: 'app/bots/gdax-1',
                method: 'DELETE'
            }).flush({status: 200, statusText: 'Ok'});

        })));

        it('should return status response of \'false\' if not successful', async(inject([], () => {

            service.deleteBotConfigById('gdax-unknown')
                .then(response => {
                    expect(response).toBe(false);
                });

            backend.expectOne({
                url: 'app/bots/gdax-unknown',
                method: 'DELETE'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });
});

const makeBotConfigData = () => [
    new BotConfig('bitstamp-1', 'Bitstamp Bot', 'https://jakku.com/api/v1', 'rey', 'force'),
    new BotConfig('gdax-1', 'GDAX Bot', 'https://tatooine.com/api/v1', 'luke', 'podracer')
] as BotConfig[];

