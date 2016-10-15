import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {Exchange, ExchangeRestClientService} from "../model";

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

    constructor(private router: Router, private exchangeRestClientService: ExchangeRestClientService) {
    }

    ngOnInit(): void {
        this.exchangeRestClientService.getExchanges()
            .then(exchanges => this.exchanges = exchanges.slice(0, 8));
    }

    gotoDetail(exchange: Exchange): void {
        let link = ['/exchange', exchange.id];
        this.router.navigate(link);
    }

    trackByExchangeId(index: number, exchange: Exchange) { return exchange.id; }
}
