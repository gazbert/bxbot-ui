import {Component, OnInit} from "@angular/core";
import {ExchangeRestClientService} from "./exchange-rest-client.service";
import {Exchange} from "./exchange";
import {Router} from "@angular/router";

@Component({
    selector: 'my-dashboard',
    templateUrl: 'app/dashboard.component.html',
    styleUrls: ['app/dashboard.component.css']
})

export class DashboardComponent implements OnInit {

    exchanges: Exchange[] = [];

    constructor(private router: Router, private exchangeRestClientService: ExchangeRestClientService) {
    }

    ngOnInit(): void {
        this.exchangeRestClientService.getExchanges()
            .then(exchanges => this.exchanges = exchanges.slice(1, 9));
    }

    gotoDetail(exchange: Exchange): void {
        let link = ['/detail', exchange.id];
        this.router.navigate(link);
    }
}
