import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Bot} from '../model/bot';

/**
 * Represents a Dashboard Item component.
 * An item is a Bot!
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
    @Input() bot: Bot;
    @Output() selected = new EventEmitter<Bot>();

    click() {
        this.selected.next(this.bot);
    }
}

