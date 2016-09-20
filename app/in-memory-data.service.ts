import {InMemoryDbService} from "angular2-in-memory-web-api";

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let exchanges = [
            {id: 10, name: 'Bitstamp'},
            {id: 11, name: 'GDAX'},
            {id: 12, name: 'Gemini'},
            {id: 13, name: 'ItBit'},
            {id: 14, name: 'BTC-e'},
            {id: 15, name: 'OKCoin'},
            {id: 16, name: 'Bitfinex'},
            {id: 17, name: 'Huobi'},
            {id: 18, name: 'Kraken'}
        ];
        return {exchanges};
    }
}
