// import {MockBackend, MockConnection} from '@angular/http/testing';
// import {Http, HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
// import {async, inject, TestBed} from '@angular/core/testing';
// import {ExchangeHttpDataPromiseService as ExchangeDataService} from './exchange-http-data-promise.service';
// import {Exchange, NetworkConfig, OptionalConfig} from '../exchange.model';
//
// /**
//  * Tests the Exchange HTTP Data service (Promise flavour) using a Mock HTTP backend.
//  *
//  * TODO - test non 200 OK responses etc from bxbot-ui-server - UI should handle scenario gracefully!
//  *
//  * @author gazbert
//  */
// describe('ExchangeHttpDataPromiseService tests using TestBed + Mock HTTP backend', () => {
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [HttpModule],
//             providers: [
//                 ExchangeDataService,
//                 {provide: XHRBackend, useClass: MockBackend}
//             ]
//         }).compileComponents().then(() => {/*done*/
//         });
//     }));
//
//     it('should instantiate implementation of ExchangeDataService when injected',
//         inject([ExchangeDataService], (service: ExchangeDataService) => {
//             expect(service instanceof ExchangeDataService).toBe(true);
//         }));
//
//     it('should instantiate service with "new"', inject([Http], (http: Http) => {
//         expect(http).not.toBeNull('http should be provided');
//         const service = new ExchangeDataService(http);
//         expect(service instanceof ExchangeDataService).toBe(true,
//             'new service should be instance of ExchangeDataService');
//     }));
//
//     it('should provide MockBackend as replacement for XHRBackend',
//         inject([XHRBackend], (backend: MockBackend) => {
//             expect(backend).not.toBeNull('MockBackend should be provided');
//         }));
//
//     describe('when getExchangeByBotId() operation called with \'gdax\'', () => {
//
//         let backend: MockBackend;
//         let service: ExchangeDataService;
//         let fakeExchanges: Exchange[];
//         let response: Response;
//         const GDAX_EXCHANGE_INDEX = 2;
//
//         beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
//             backend = mockBackend;
//             service = new ExchangeDataService(http);
//             fakeExchanges = makeExchangesData();
//             const options = new ResponseOptions({status: 200, body: {data: fakeExchanges[GDAX_EXCHANGE_INDEX]}});
//             response = new Response(options);
//         }));
//
//         it('should return GDAX Exchange', async(inject([], () => {
//             backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
//             service.getExchangeByBotId('gdax')
//                 .then(exchange => {
//                     expect(exchange.id).toBe('gdax');
//                     expect(exchange.name).toBe('GDAX');
//                     expect(exchange.adapterClass).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
//                     expect(exchange.networkConfig.connectionTimeout).toBe(60);
//
//                     expect(exchange.networkConfig.nonFatalHttpStatusCodes.length).toBe(3);
//                     expect(exchange.networkConfig.nonFatalHttpStatusCodes[0]).toBe(503);
//                     expect(exchange.networkConfig.nonFatalHttpStatusCodes[1]).toBe(504);
//                     expect(exchange.networkConfig.nonFatalHttpStatusCodes[2]).toBe(522);
//
//                     expect(exchange.networkConfig.nonFatalErrorMessages.length).toBe(3);
//                     expect(exchange.networkConfig.nonFatalErrorMessages[0]).toBe('Connection reset');
//                     expect(exchange.networkConfig.nonFatalErrorMessages[1]).toBe('Connection refused');
//                     expect(exchange.networkConfig.nonFatalErrorMessages[2]).toBe(
//                         'Remote host closed connection during handshake');
//
//                     expect(exchange.optionalConfig.configItems.length).toBe(2);
//                     expect(exchange.optionalConfig.configItems[0].name).toBe('buy-fee');
//                     expect(exchange.optionalConfig.configItems[0].value).toBe('0.2');
//                     expect(exchange.optionalConfig.configItems[1].name).toBe('sell-fee');
//                     expect(exchange.optionalConfig.configItems[1].value).toBe('0.25');
//                 });
//         })));
//
//         it('should handle returning no Exchange', async(inject([], () => {
//             const resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
//             backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
//             service.getExchangeByBotId('unknown')
//                 .then(exchange => expect(exchange.id).not.toBeDefined('should have no Exchange'));
//         })));
//     });
//
//     describe('when update() operation called for Bitstamp', () => {
//
//         let backend: MockBackend;
//         let service: ExchangeDataService;
//         let response: Response;
//         let updatedExchange: Exchange;
//
//         beforeEach(inject([Http, XHRBackend], (http: Http, mockBackend: MockBackend) => {
//
//             updatedExchange = new Exchange('bitstamp', 'Bitstamp v2',
//                 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2',
//                 new NetworkConfig(90,
//                     [
//                         504,
//                         505,
//                         506,
//                     ],
//                     [
//                         'Connection reset again!',
//                         'Connection refused again!',
//                         'Remote host closed connection during handshake again!'
//                     ]
//                 ),
//                 new OptionalConfig([
//                         {
//                             name: 'buy-fee',
//                             value: '0.2'
//                         },
//                         {
//                             name: 'sell-fee',
//                             value: '0.25'
//                         }
//                     ]
//                 ));
//
//             backend = mockBackend;
//             service = new ExchangeDataService(http);
//             const options = new ResponseOptions({status: 200, body: {data: updatedExchange}});
//             response = new Response(options);
//         }));
//
//         it('should return updated Bitstamp Exchange on success', async(inject([], () => {
//             backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
//             service.updateExchange('bitstamp', updatedExchange)
//                 .then(exchange => {
//                     expect(exchange).toBe(updatedExchange);
//
//                     // paranoia!
//                     expect(exchange.id).toBe('bitstamp');
//                     expect(exchange.name).toBe('Bitstamp v2');
//                     expect(exchange.adapterClass).toBe('com.gazbert.bxbot.exchanges.BitstampExchangeAdapterV2');
//                 });
//         })));
//
//         it('should NOT return Exchange for 401 response', async(inject([], () => {
//             const resp = new Response(new ResponseOptions({status: 401, body: {data: ['Bad request - unknown id']}}));
//             backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
//             service.updateExchange('unknown', updatedExchange)
//                 .then(exchange => expect(exchange.id).not.toBeDefined('should have no Exchange'));
//         })));
//     });
// });
//
// const makeExchangesData = () => [
//     new Exchange('bitstamp', 'Bitstamp', 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter',
//         new NetworkConfig(60,
//             [
//                 501,
//                 502,
//                 503,
//             ],
//             [
//                 'Connection reset',
//                 'Connection refused',
//                 'Remote host closed connection during handshake'
//             ]
//         ),
//         new OptionalConfig([
//                 {
//                     name: 'buy-fee',
//                     value: '0.2'
//                 },
//                 {
//                     name: 'sell-fee',
//                     value: '0.25'
//                 }
//             ]
//         )
//     ),
//     new Exchange('gemini', 'Gemini', 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter',
//         new NetworkConfig(60,
//             [
//                 504,
//                 505,
//                 522,
//             ],
//             [
//                 'Connection reset',
//                 'Connection refused',
//                 'Remote host closed connection during handshake'
//             ]
//         ),
//         new OptionalConfig([
//                 {
//                     name: 'buy-fee',
//                     value: '0.2'
//                 },
//                 {
//                     name: 'sell-fee',
//                     value: '0.25'
//                 }
//             ]
//         )
//     ),
//     new Exchange('gdax', 'GDAX', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
//         new NetworkConfig(60,
//             [
//                 503,
//                 504,
//                 522,
//             ],
//             [
//                 'Connection reset',
//                 'Connection refused',
//                 'Remote host closed connection during handshake'
//             ]
//         ),
//         new OptionalConfig([
//                 {
//                     name: 'buy-fee',
//                     value: '0.2'
//                 },
//                 {
//                     name: 'sell-fee',
//                     value: '0.25'
//                 }
//             ]
//         )
//     )
// ] as Exchange[];
//
