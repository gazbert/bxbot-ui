import {Injectable} from "@angular/core";
import {EXCHANGES} from "./test-exchange-adapters";
import {Exchange} from "../shared/exchange.model";

/**
 * Dummy ExchangeAdapterDataService. Pretend it makes real http requests.
 *
 * @author gazbert
 */
@Injectable()
export class ExchangeAdapterDataService {

    getExchanges() {
        return Promise.resolve(EXCHANGES);
    }

    getExchange(id: string): Promise<Exchange> {
        return this.getExchanges().then(
            exchanges => exchanges.find(exchange => exchange.id === id)
        );
    }

    saveExchange(exchange: Exchange): Promise<Exchange> {
        return this.getExchange(exchange.id).then(e => {
            if (!e) {
                throw new Error(`Exchange ${exchange.id} not found`);
            }
            return Object.assign(e, exchange);
        });
    }
}
