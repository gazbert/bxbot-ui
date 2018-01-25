import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, inject, TestBed} from '@angular/core/testing';
import {StrategyHttpDataService as StrategyDataService} from './strategy-http-data.service';
import {HttpClient} from '@angular/common/http';
import {OptionalConfig, Strategy} from './strategy.model';

/**
 * Tests the Strategy HTTP Data service using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('StrategyHttpDataService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [StrategyDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getAllStrategiesForBotId() operation called with \'huobi\'', () => {

        let backend: HttpTestingController;
        let service: StrategyDataService;
        let strategies: Strategy[];

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpTestingController: HttpTestingController) => {
            backend = httpTestingController;
            service = new StrategyDataService(http);
            strategies = makeStrategyData();
        }));

        it('should return 2 Huobi Strategies', async(inject([], () => {

            service.getAllStrategiesForBotId('huobi-1')
                .then(response => {

                    expect(response).toBe(strategies);

                    // paranoia!
                    expect(strategies[0].id).toBe('huobi_macd');
                    expect(strategies[1].id).toBe('huobi_ema');
                });

            backend.expectOne({
                url: 'app/strategies?botId=huobi-1',
                method: 'GET'
            }).flush(strategies, {status: 200, statusText: 'Ok'});

        })));

        it('should handle returning no matching Strategies', async(inject([], () => {

            service.getAllStrategiesForBotId('gdax-unknown')
                .then(response => {
                    expect(response.length).toBe(0);
                });

            backend.expectOne({
                url: 'app/strategies?botId=gdax-unknown',
                method: 'GET'
            }).flush([], {status: 200, statusText: 'Ok'});

        })));
    });

    describe('when updateStrategy() operation called for Huobi', () => {

        let backend: HttpTestingController;
        let service: StrategyDataService;
        let updatedStrategy: Strategy;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {

            updatedStrategy = new Strategy('huobi_macd', 'huobi-1', 'New MACD Indicator',
                'MACD Indicator algo for deciding when to enter and exit trades.',
                'com.gazbert.bxbot.strategies.MacdStrategy',

                new OptionalConfig([
                        {
                            name: 'ema-short-interval',
                            value: '12'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '26'
                        },
                        {
                            name: 'signal-line',
                            value: '9'
                        }
                    ]
                )
            );

            backend = testController;
            service = new StrategyDataService(http);
        }));

        it('should return updated Huobi Strategy on success', async(inject([], () => {

            service.updateStrategy('huobi-1', updatedStrategy)
                .then(response => {
                    expect(response).toBe(updatedStrategy);

                    // paranoia!
                    expect(response.name).toBe('New MACD Indicator');
                });

            backend.expectOne({
                url: 'app/strategies/huobi_macd',
                method: 'PUT'
            }).flush(updatedStrategy, {status: 200, statusText: 'Ok'});

        })));

        it('should NOT return Strategy for unknown strategyId', async(inject([], () => {

            const unknownStrategy = new Strategy('unknown-strat-id', 'huobi-1', 'New MACD Indicator',
                'MACD Indicator algo for deciding when to enter and exit trades.',
                'com.gazbert.bxbot.strategies.MacdStrategy',

                new OptionalConfig([
                        {
                            name: 'ema-short-interval',
                            value: '12'
                        },
                        {
                            name: 'ema-long-interval',
                            value: '26'
                        },
                        {
                            name: 'signal-line',
                            value: '9'
                        }
                    ]
                )
            );

            service.updateStrategy('unknown-strat-id', unknownStrategy)
                .then(response => {
                    expect(response.name).toBeUndefined();
                });

            backend.expectOne({
                url: 'app/strategies/unknown-strat-id',
                method: 'PUT'
            }).flush({status: 404, statusText: 'Not Found'});
        })));
    });

    describe('when deleteStrategyById() operation called with \'huobi_macd\'', () => {

        let backend: HttpTestingController;
        let service: StrategyDataService;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, be: HttpTestingController) => {
            backend = be;
            service = new StrategyDataService(http);
        }));

        xit('should return status response of \'true\' if successful', async(inject([], () => {

            service.deleteStrategyById('huobi-1', 'huobi_macd')
                .then(response => {
                    expect(response).toEqual(true);
                });

            backend.expectOne({
                url: 'app/strategies/huobi_macd',
                method: 'DELETE'
            }).flush({status: 200, statusText: 'Ok'});

        })));

        xit('should return status response of \'false\' if NOT successful', async(inject([], () => {

            service.deleteStrategyById('huobi-1', 'gdax-unknown')
                .then(response => {
                    expect(response).toEqual(false);
                });

            backend.expectOne({
                url: 'app/strategies/gdax-unknown',
                method: 'DELETE'
            }).flush({status: 404, statusText: 'Not Found'});

        })));
    });
});

const makeStrategyData = () => [

    new Strategy('huobi_macd', 'huobi-2', 'MACD Indicator',
        'MACD Indicator algo for deciding when to enter and exit trades.',
        'com.gazbert.bxbot.strategies.MacdRsiStrategy',

        new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                },
                {
                    name: 'signal-line',
                    value: '9'
                }
            ]
        )
    ),

    new Strategy('huobi_ema', 'huobi-2', 'EMA Indicator',
        'EMA Indicator for deciding when to enter and exit trades.', 'com.gazbert.bxbot.strategies.EmaStrategy',

        new OptionalConfig([
                {
                    name: 'ema-short-interval',
                    value: '12'
                },
                {
                    name: 'ema-long-interval',
                    value: '26'
                }
            ]
        )
    )
] as Strategy[];
