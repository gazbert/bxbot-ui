import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {Exchange, ExchangeHttpDataObservableService} from "../model/exchange";

// Need to explicitly import rxjs operators, else you get runtime error, e.g. 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/operator/map';

/**
 * The Dashboard displays the Exchanges the bots are running on.
 * It provides the landing screen and Command & Control centre for the app.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    exchanges: Exchange[] = [];
    errorMessage: string;

    static trackByExchangeId(index: number, exchange: Exchange) {
        return exchange.id;
    }

    constructor(private router: Router, private exchangeDataService: ExchangeHttpDataObservableService) {
    }

    ngOnInit(): void {
        this.exchangeDataService.getExchanges()
            .subscribe(exchanges => {
                    this.exchanges = exchanges.slice(0, 8); // Limit to just first 8 exchanges for demo
                },
                error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
    }

    search(filter: string) {
        this.exchangeDataService.getExchangeByName(filter)
            .subscribe(exchanges => {
                    this.exchanges = exchanges.slice(0, 8); // Limit to just first 8 exchanges for demo
                },
                error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
    }

    gotoExchangeDetails(exchange: Exchange): void {

        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/exchange', exchange.id];
        // this.router.navigate(link);

        let url = `/exchange/${exchange.id}`;
        this.router.navigateByUrl(url);
    }
}
