import {OnInit, Component} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Exchange, ExchangeRestClientService} from "../shared";

/**
 * Wrapper for Exchange Details.
 */
@Component({
    moduleId: module.id,
    selector: 'bx-exchange-details',
    templateUrl: 'exchange-details.component.html',
    styleUrls: ['exchange-details.component.css']
})
export class ExchangeDetailsComponent implements OnInit {

    exchange: Exchange;
    active = true;

    constructor(private exchangeRestClientService: ExchangeRestClientService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeRestClientService.getExchange(id)
                .then(exchange => this.exchange = exchange);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }
}

