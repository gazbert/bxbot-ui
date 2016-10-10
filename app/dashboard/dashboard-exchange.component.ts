import {Component, EventEmitter, Input, Output} from "@angular/core";
import {Exchange} from "../shared/exchange.model";

/**
 * TODO - show status of the bot operating on the exchange here.
 */
@Component({
    moduleId: module.id,
    selector: 'dashboard-exchange',
    templateUrl: 'dashboard-exchange.component.html',
    styleUrls: ['dashboard-exchange.component.css']
})
export class DashboardExchangeComponent {
    @Input() exchange: Exchange;
    @Output() selected = new EventEmitter<Exchange>();

    click() {
        this.selected.next(this.exchange);
    }
}

