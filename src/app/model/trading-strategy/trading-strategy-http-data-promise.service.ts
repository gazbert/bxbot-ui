import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {TradingStrategy} from "./trading-strategy.model";
import {TradingStrategyDataPromiseService} from "./trading-strategy-data-promise.service";

// *** Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Trading Strategy Data Service.
 * It demonstrates use of Promises in call responses.
 * Seems easier to use/understand than Observable way?
 *
 * @author gazbert
 */
@Injectable()
export class TradingStrategyHttpDataPromiseService implements TradingStrategyDataPromiseService {

    public tradingStrategiesUrl = 'app/tradingStrategies';  // URL to web api
    // vs JSON canned data for quick testing below...
    // private tradingStrategiesUrl = 'app/trading-strategies.json'; // URL to JSON file

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getAllTradingStrategiesForExchange(exchangeId: string): Promise<TradingStrategy[]> {
        const url = this.tradingStrategiesUrl + '?exchangeId=' + exchangeId;
        return this.http.get(url)
            .toPromise()
            .then(response => response.json().data as TradingStrategy[])
            .catch(this.handleError);
    }

    updateTradingStrategy(tradingStrategy: TradingStrategy): Promise<TradingStrategy> {
        const url = this.tradingStrategiesUrl + '/' + tradingStrategy.id;
        return this.http
            .put(url, JSON.stringify(tradingStrategy), {headers: this.headers})
            .toPromise()
            .then(response => response.json().data as TradingStrategy)
            .catch(this.handleError);
    }

    // TODO - return deleted Trading Strat? Or remove returned Promise
    deleteTradingStrategyById(tradingStrategyId: string): Promise<TradingStrategy> {
        const url = this.tradingStrategiesUrl + '/' + tradingStrategyId;
        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then()
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
