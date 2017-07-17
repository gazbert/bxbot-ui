import {OnInit, Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Bot, BotHttpDataPromiseService} from '../model/bot';

/**
 * Container for holding the config screens.
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

    exchange: Bot;
    active = true;

    constructor(private exchangeDataService: BotHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeDataService.getBot(id)
                .then(exchange => this.exchange = exchange);
        }).then(() => {/*done*/});
    }
}

