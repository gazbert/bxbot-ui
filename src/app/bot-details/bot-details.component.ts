import {OnInit, Component} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Bot, BotHttpDataPromiseService} from '../model/bot';

/**
 * Container for holding the Bot config and status screens.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-bot-details',
    templateUrl: 'bot-details.component.html',
    styleUrls: ['bot-details.component.css']
})
export class BotDetailsComponent implements OnInit {

    bot: Bot;
    active = true;

    constructor(private exchangeDataService: BotHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = params['id'];
            this.exchangeDataService.getBot(id)
                .then(bot => this.bot = bot);
        }).then(() => {/*done*/});
    }
}

