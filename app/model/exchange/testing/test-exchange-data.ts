import {Exchange} from "../../exchange";

/**
 * Dummy Exchange data for testing.
 */
export var EXCHANGES: Exchange[] = [

    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Running'),
    new Exchange('gemini', 'Gemini', 'Running'),
    new Exchange('itbit', 'ItBit', 'Stopped'),
    new Exchange('btce', 'BTC-e', 'Running'),
    new Exchange('okcoin', 'OKCoin', 'Running'),
    new Exchange('bitfinex', 'Bitfinex', 'Stopped'),
    new Exchange('huobi', 'Huobi', 'Stopped'),
    new Exchange('kraken', 'Kraken', 'Running')
];