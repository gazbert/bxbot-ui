import {InMemoryDbService} from "angular2-in-memory-web-api";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {id: 'Bitstamp', adapter: 'com.gazbert.bxbot.exchanges.BitstampExchangeAdapter'},
            {id: 'GDAX', adapter: 'com.gazbert.bxbot.exchanges.GdaxExchangeAdapter'},
            {id: 'Gemini', adapter: 'com.gazbert.bxbot.exchanges.GeminiExchangeAdapter'},
            {id: 'ItBit', adapter: 'com.gazbert.bxbot.exchanges.ItBitExchangeAdapter'},
            {id: 'BTC-e', adapter: 'com.gazbert.bxbot.exchanges.BtceExchangeAdapter'},
            {id: 'OKCoin', adapter: 'com.gazbert.bxbot.exchanges.OkCoinExchangeAdapter'},
            {id: 'Bitfinex', adapter: 'com.gazbert.bxbot.exchanges.BitfinexExchangeAdapter'},
            {id: 'Huobi', adapter: 'com.gazbert.bxbot.exchanges.HuobiExchangeAdapter'},
            {id: 'Kraken', adapter: 'com.gazbert.bxbot.exchanges.KrakenExchangeAdapter'}
        ];
        return {exchanges};
    }
}
