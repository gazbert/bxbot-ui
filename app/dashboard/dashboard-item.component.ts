import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Exchange} from "../model";

/**
 * TODO - show status of the bot operating on the exchange here.
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

