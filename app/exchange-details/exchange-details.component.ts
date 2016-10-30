import {OnInit, Component} from "@angular/core";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Exchange, ExchangeHttpDataPromiseService} from "../model/exchange";

/**
 * Container component for holding Exchange Details.
 *
 * @author gazbert
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

    constructor(private exchangeDataService: ExchangeHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeDataService.getExchange(id)
                .then(exchange => this.exchange = exchange);
        });
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }
}

