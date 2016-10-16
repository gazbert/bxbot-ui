import "rxjs/add/operator/toPromise";
import {Exchange} from "../model";

/**
 * The Exchange Data Service communicates with the trading bots.
 * Service is used to update the bot's Exchange configuration.
 *
 * @author gazbert
 */
export interface ExchangeDataService {

    getExchanges(): Promise<Exchange[]>;
    getExchange(id: string): Promise<Exchange>;
    update(exchange: Exchange): Promise<Exchange>;
}
