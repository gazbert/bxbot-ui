import {Exchange} from "./exchange";
import {ActivatedRoute, Params} from "@angular/router";
import {ExchangeRestClientService} from "./exchange-rest-client.service";
import {OnInit, Component} from "@angular/core";

@Component({
    selector: 'my-exchange-detail',
    templateUrl: 'app/exchange-detail.component.html',
    styleUrls: ['app/exchange-detail.component.css']
})

export class ExchangeDetailComponent implements OnInit {

    exchange: Exchange;

    constructor(private exchangeRestClientService: ExchangeRestClientService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeRestClientService.getExchange(id)
                .then(exchange => this.exchange = exchange);
        });
    }

    goBack(): void {
        window.history.back();
    }

    save(): void {
        this.exchangeRestClientService.update(this.exchange)
            .then(this.goBack);
    }

}

