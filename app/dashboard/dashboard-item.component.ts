import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Exchange} from '../model/exchange';

/**
 * Represents a Dashboard Item component.
 * Essentially, an item is the Exchange the bot is running on.
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
    @Input() exchange: Exchange;
    @Output() selected = new EventEmitter<Exchange>();

    click() {
        this.selected.next(this.exchange);
    }
}

