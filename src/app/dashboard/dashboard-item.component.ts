import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bot} from '../model/bot';

/**
 * Represents a Dashboard Item component.
 * Essentially, an item is the Bot the bot is running on.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-dashboard-item',
    templateUrl: 'dashboard-item.component.html',
    styleUrls: ['dashboard-item.component.css']
})
export class DashboardItemComponent {
    @Input() exchange: Bot;
    @Output() selected = new EventEmitter<Bot>();

    click() {
        this.selected.next(this.exchange);
    }
}

