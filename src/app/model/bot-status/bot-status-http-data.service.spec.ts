import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {BotStatus} from './bot-status.model';
import {BotStatusHttpDataService as BotStatusDataService} from './bot-status-http-data.service';

/**
 * Tests the BotStatus HTTP Data Service using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('BotStatusHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [BotStatusDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getAllBotStatus() operation called', () => {

        let backend: HttpTestingController;
        let service: BotStatusDataService;
        let botStatuses: BotStatus[];

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotStatusDataService(http);
            botStatuses = makeBotStatusData();
        }));

        it('should return all Bot Statuses ', async(inject([], () => {

            service.getAllBotStatus()
                .subscribe(response => {
                    expect(response.length).toBe(botStatuses.length, 'should have returned 3 Bots');

                    // paranoia!
                    expect(response[0].id).toBe('bitstamp-1');
                    expect(response[1].id).toBe('gdax-2');
                    expect(response[2].id).toBe('gemini-3');
                });

            backend.expectOne({
                url: 'app/status',
                method: 'GET'
            }).flush(botStatuses, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no Bot Statues', async(inject([], () => {

            service.getAllBotStatus()
                .subscribe(response => {
                    expect(response.length).toBe(0, 'should have returned 3 Bots');
                });

            backend.expectOne({
                url: 'app/status',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));

    });

    describe('when getBotStatusById() operation called with \'gdax-2\'', () => {

        let backend: HttpTestingController;
        let service: BotStatusDataService;
        let botStatuses: BotStatus[];
        const GDAX_BOT_IDX = 1;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotStatusDataService(http);
            botStatuses = makeBotStatusData();
        }));

        it('should return GDAX BotStatus', async(inject([], () => {

            service.getBotStatusById('gdax-2')
                .subscribe(botStatus => {
                    expect(botStatus).toEqual(botStatuses[GDAX_BOT_IDX]);

                    // paranoia!
                    expect(botStatus.id).toBe('gdax-2');
                });

            backend.expectOne({
                url: 'app/status/gdax-2',
                method: 'GET'
            }).flush(botStatuses[GDAX_BOT_IDX], {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no BotStatus', async(inject([], () => {

            service.getBotStatusById('gdax-unknown')
                .subscribe(botStatus => {
                    expect(botStatus.id).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/status/gdax-unknown',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when getBotStatusByBotName() operation called with \'GDAX\'', () => {

        let backend: HttpTestingController;
        let service: BotStatusDataService;
        let botStatuses: BotStatus[];
        const GDAX_BOT_IDX = 1;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new BotStatusDataService(http);
            botStatuses = makeBotStatusData();
        }));

        it('should have returned GDAX BotStatus', async(inject([], () => {

            service.getBotStatusByBotName('GDAX')
                .subscribe(response => {
                    expect(response.length).toEqual(1);
                    expect(response[0]).toEqual(botStatuses[GDAX_BOT_IDX]);

                    // paranoia!
                    expect(response[0].id).toBe('gdax-2');
                });

            backend.expectOne({
                url: 'app/status/?name=GDAX',
                method: 'GET'
            }).flush([botStatuses[GDAX_BOT_IDX]], {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no BotStatus', async(inject([], () => {

            service.getBotStatusByBotName('UNKNOWN')
                .subscribe(response => {
                    expect(response.length).toEqual(0);
                });

            backend.expectOne({
                url: 'app/status/?name=UNKNOWN',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });
});

const makeBotStatusData = () => [
    new BotStatus('bitstamp-1', 'Bitstamp', 'Running'),
    new BotStatus('gdax-2', 'GDAX', 'Stopped'),
    new BotStatus('gemini-3', 'Gemini', 'Running')
] as BotStatus[];
