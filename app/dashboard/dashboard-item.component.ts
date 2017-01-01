import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Exchange} from '../model/exchange';

/**
 * Dashboard Item component - there is 1 per Exchange.
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

