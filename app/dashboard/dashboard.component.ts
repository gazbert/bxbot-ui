import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {ExchangeRestClientService} from "../shared/exchange-rest-client.service";
import {Exchange} from "../shared/exchange.model";

@Component({
    selector: 'bx-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styleUrls: ['app/dashboard/dashboard.component.css']
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
        let link = ['/detail', exchange.id];
        this.router.navigate(link);
    }
}
