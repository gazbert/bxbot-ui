// import {Exchange, NetworkConfig} from "./exchange.model";
//
// /**
//  * Tests the Exchange Adapter model behaves as expected.
//  *
//  * @author gazbert
//  */
// describe('Exchange Adapter', () => {
//
//     it('has correct initial values', () => {
//         const exchange =
//             new Exchange('gdax', 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter',
//                 new NetworkConfig(60,
//                     [
//                         {value: 503},
//                         {value: 504},
//                         {value: 522},
//                     ],
//                     [
//                         {value: "Connection reset"},
//                         {value: "Connection refused"},
//                         {value: "Remote host closed connection during handshake"}
//                     ]
//                 ));
//
//         expect(exchange.id).toBe('gdax');
//         expect(exchange.exchangeId).toBe('gdax');
//         expect(exchange.adapter).toBe('com.gazbert.bxbot.exchanges.GdaxExchangeAdapter');
//         // TODO etc etc ...
//     });
//
//     it('can clone itself', () => {
//         const exchange =
//             new Exchange('btce', 'btce', 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter',
//                 new NetworkConfig(60,
//                     [
//                         {value: 503},
//                         {value: 504},
//                         {value: 522},
//                     ],
//                     [
//                         {value: "Connection reset"},
//                         {value: "Connection refused"},
//                         {value: "Remote host closed connection during handshake"}
//                     ]
//                 ));
//
//         const clone = exchange.clone();
//         expect(exchange).toEqual(clone);
//     });
// });