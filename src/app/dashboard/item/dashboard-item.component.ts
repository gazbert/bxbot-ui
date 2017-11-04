import {Component, EventEmitter, Input, Output} from '@angular/core';
import {BotStatus} from '../../model/bot-status';

/**
 * Represents a Dashboard Item component.
 * An item is a Bot.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-dashboard-item',
    templateUrl: 'dashboard-item.component.html',
    styleUrls: ['dashboard-item.component.css']
})
export class DashboardItemComponent {
    @Input() bot: BotStatus;
    @Output() selected = new EventEmitter<BotStatus>();

    click() {
        this.selected.next(this.bot);
    }
}

