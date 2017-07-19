import {OnInit, Component} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Bot, BotHttpDataObservableService} from '../model/bot';

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
    errorMessage: string;

    constructor(private botDataService: BotHttpDataObservableService, private route: ActivatedRoute) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let botId = params['id'];
            this.botDataService.getBot(botId)
                .subscribe(bot => {
                        this.bot = bot;
                    },
                    error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
        }).then(() => {/*done*/});
    }
}

