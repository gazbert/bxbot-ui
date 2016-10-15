import {Injectable} from '@angular/core';
import {Exchange} from "../shared/exchange.model";
import {ExchangeAdapterDataService} from "../model/exchange-adapter-data.service";

@Injectable()
export class ExchangeAdapterService {

    constructor(private exchangeAdapterDataService: ExchangeAdapterDataService) {
    }

    // Returns a clone which caller may modify safely
    getExchange(id: string): Promise<Exchange> {
        return this.exchangeAdapterDataService.getExchange(id).then(exchange => {
            return exchange ? Object.assign({}, exchange) : null; // clone or null
        });
    }

    saveExchange(exchange: Exchange) {
        return this.exchangeAdapterDataService.saveExchange(exchange);
    }
}