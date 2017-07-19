import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {AppComponent} from "../../app.component";
import {TradingStrategy} from "./trading-strategy.model";
import {TradingStrategyDataPromiseService} from "./trading-strategy-data-promise.service";

// Don't forget this else you get runtime error:
// zone.js:355 Unhandled Promise rejection: this.http.get(...).toPromise is not a function
import 'rxjs/add/operator/toPromise';

/**
 * HTTP implementation of the Trading Strategy Data Service.
 *
 * It demonstrates use of Promises in call responses.
 *
 * We chain the toPromise operator to the Observable result of http.get. It converts the Observable into a Promise
 * which is passed back to the caller.
 *
 * Converting to a promise is a good choice when asking http.get to fetch a single chunk of data - when we receive the
 * data, we're done. A single result in the form of a promise is easy for the calling component to understand/consume.
 *
 * @author gazbert
 */
@Injectable()
export class TradingStrategyHttpDataPromiseService implements TradingStrategyDataPromiseService {

    private tradingStrategiesUrl = AppComponent.REST_API_BASE_URL + '/tradingStrategies';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    getAllTradingStrategiesForBotId(botId: number): Promise<TradingStrategy[]> {
        const url = this.tradingStrategiesUrl + '?botId=' + botId;
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

    deleteTradingStrategyById(tradingStrategyId: string): Promise<boolean> {
        const url = this.tradingStrategiesUrl + '/' + tradingStrategyId;
        return this.http
            .delete(url, {headers: this.headers})
            .toPromise()
            .then(response => response.status === 200)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
