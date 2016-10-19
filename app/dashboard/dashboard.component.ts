import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {Exchange, ExchangeHttpDataService} from "../model";

/**
 * The Dashboard component lists the Exchanges the bot is running on.
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

    constructor(private router: Router, private exchangeDataService: ExchangeHttpDataService) {
    }

    ngOnInit(): void {
        this.exchangeDataService.getExchangesUsingPromise()
            .then(exchanges => this.exchanges = exchanges.slice(0, 8));
    }

    gotoExchangeDetails(exchange: Exchange): void {

        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/exchange', exchange.id];
        // this.router.navigate(link);

        let url = `/exchange/${exchange.id}`;
        this.router.navigateByUrl(url);
    }

    static trackByExchangeId(index: number, exchange: Exchange) { return exchange.id; }
}
