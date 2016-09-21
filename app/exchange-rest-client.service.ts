import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import "rxjs/add/operator/toPromise";
import {Exchange} from "./exchange";

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

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
