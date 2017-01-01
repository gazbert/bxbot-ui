import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {Exchange, ExchangeHttpDataPromiseService} from '../model/exchange';

/**
 * The Dashboard component displays the Exchanges that the bots are running on.
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

    static trackByExchangeId(index: number, exchange: Exchange) { return exchange.id; }

    constructor(private router: Router, private exchangeDataService: ExchangeHttpDataPromiseService) {
    }

    ngOnInit(): void {
        this.exchangeDataService.getExchanges()
            .then(exchanges => this.exchanges = exchanges.slice(0, 8));
    }

    gotoExchangeDetails(exchange: Exchange): void {

        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/exchange', exchange.id];
        // this.router.navigate(link);

        let url = `/exchange/${exchange.id}`;
        this.router.navigateByUrl(url);
    }
}
