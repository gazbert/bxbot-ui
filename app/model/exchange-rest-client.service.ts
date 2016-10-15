import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Exchange} from "../model";

@Injectable()
export class ExchangeRestClientService {

    private exchangeUrl = 'app/exchanges';  // URL to web api

    constructor(private http: Http) {
    }

    getExchanges(): Promise<Exchange[]> {
        return this.http.get(this.exchangeUrl)
            .toPromise()
            .then(response => response.json().data as Exchange[])
            .catch(this.handleError);
    }

    getExchange(id: string): Promise<Exchange> {
        return this.getExchanges().then(exchanges => exchanges.find(exchange => exchange.id === id));
    }

    private headers = new Headers({'Content-Type': 'application/json'});

    update(exchange: Exchange): Promise<Exchange> {
        const url = `${this.exchangeUrl}/${exchange.id}`;
        return this.http
            .put(url, JSON.stringify(exchange), {headers: this.headers})
            .toPromise()
            .then(() => exchange)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
