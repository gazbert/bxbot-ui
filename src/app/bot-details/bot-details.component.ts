import {OnInit, Component} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {BotStatus, BotStatusHttpDataService} from '../model/bot-status';

/**
 * Container for holding the Bot config and status screens.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-bot-details',
    templateUrl: 'bot-details.component.html',
    styleUrls: ['bot-details.component.css']
})
export class BotDetailsComponent implements OnInit {

    bot: BotStatus;
    active = true;
    errorMessage: string;

    constructor(private botDataService: BotStatusHttpDataService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const botId = params['id'];
            this.botDataService.getBot(botId)
                .subscribe(bot => {
                        this.bot = bot;
                    },
                    error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
        }).then(() => {/*done*/});
    }
}

