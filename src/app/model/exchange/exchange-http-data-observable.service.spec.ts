import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, inject, TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {ExchangeHttpDataObservableService as ExchangeDataService} from './exchange-http-data-observable.service';
import {Exchange, NetworkConfig, OptionalConfig} from './exchange.model';

/**
 * Tests the Exchange HTTP Data service using a mocked HTTP backend.
 *
 * @author gazbert
 */
describe('ExchangeHttpDataObservableService tests using HttpClientTestingModule', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [ExchangeDataService]
        });
    }));

    afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
        backend.verify();
    }));

    describe('when getExchangeByBotId() operation called with \'gdax\'', () => {

        let backend: HttpTestingController;
        let service: ExchangeDataService;
        let exchanges: Exchange[];
        const GDAX_EXCHANGE_INDEX = 1;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {
            backend = testController;
            service = new ExchangeDataService(http);
            exchanges = makeExchangesData();
        }));

        it('should return GDAX Exchange', async(inject([], () => {

            service.getExchangeByBotId('gdax')
                .subscribe(response => {

                    expect(response).toBe(exchanges[GDAX_EXCHANGE_INDEX]);

                    // paranoia!
                    expect(response.name).toBe('GDAX');
                });

            backend.expectOne({
                url: 'app/exchange?botId=gdax',
                method: 'GET'
            }).flush(exchanges[GDAX_EXCHANGE_INDEX], {status: 200, statusText: 'Ok'});
        })));

        it('should handle returning no Exchange', async(inject([], () => {

            expect(service.getExchangeByBotId('gdax-unknown')
                .subscribe(() => {
                        fail('Should have failed with 404 response');
                    },
                    (error) => {
                        expect(error).toBe('Http failure response for app/exchange?botId=gdax-unknown: 404 Not Found');
                    }
                ));

            backend.expectOne({
                url: 'app/exchange?botId=gdax-unknown',
                method: 'GET'
            }).flush([], {status: 404, statusText: 'Not Found'});

        })));

    });

    describe('when update() operation called for Bitstamp', () => {

        let backend: HttpTestingController;
        let service: ExchangeDataService;
        let updatedExchange: Exchange;

        beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, testController: HttpTestingController) => {

            updatedExchange = new Exchange('bitstamp', 'Bitstamp v2',
                'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2',
                new NetworkConfig(90,
                    [
                        504,
                        505,
                        506,
                    ],
                    [
                        'Connection reset again!',
                        'Connection refused again!',
                        'Remote host closed connection during handshake again!'
                    ]
                ),
                new OptionalConfig([
                        {
                            name: 'buy-fee',
                            value: '0.2'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.25'
                        }
                    ]
                ));

            backend = testController;
            service = new ExchangeDataService(http);
        }));

        it('should return updated Bitstamp Exchange on success', async(inject([], () => {

            service.updateExchange('bitstamp', updatedExchange)
                .subscribe(response => {
                    expect(response).toBe(updatedExchange);

                    // paranoia!
                    expect(response.name).toBe('Bitstamp v2');
                });

            backend.expectOne({
                url: 'app/exchange/bitstamp',
                method: 'PUT'
            }).flush(updatedExchange, {status: 200, statusText: 'Ok'});

        })));

        it('should not return updated Bitstamp Exchange for unknown exchangeId', async(inject([], () => {

            const unknownExchange = new Exchange('unknown-exchange-id', 'Bitstamp v2',
                'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2',
                new NetworkConfig(90,
                    [
                        504,
                        505,
                        506,
                    ],
                    [
                        'Connection reset again!',
                        'Connection refused again!',
                        'Remote host closed connection during handshake again!'
                    ]
                ),
                new OptionalConfig([
                        {
                            name: 'buy-fee',
                            value: '0.2'
                        },
                        {
                            name: 'sell-fee',
                            value: '0.25'
                        }
                    ]
                ));

            service.updateExchange('unknown-exchange-id', unknownExchange)
                .subscribe(() => {
                        fail('Should have failed with 404 response');
                    },
                    (error) => {
                        expect(error).toBe('Http failure response for app/exchange/unknown-exchange-id: 404 Not Found');
                    }
                );

            backend.expectOne({
                url: 'app/exchange/unknown-exchange-id',
                method: 'PUT'
            }).flush(updatedExchange, {status: 404, statusText: 'Not Found'});

        })));
    });
});

const makeExchangesData = () => [
    new Exchange('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
    new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
    new Exchange('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
        new NetworkConfig(60,
            [
                503,
                504,
                522,
            ],
            [
                'Connection reset',
                'Connection refused',
                'Remote host closed connection during handshake'
            ]
        ),
        new OptionalConfig([
                {
                    name: 'buy-fee',
                    value: '0.2'
                },
                {
                    name: 'sell-fee',
                    value: '0.25'
                }
            ]
        )),
] as Exchange[];
