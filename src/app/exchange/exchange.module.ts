import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ExchangeRxComponent} from './rx/exchange-rx.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExchangeAdapterComponent} from './exchange.component';

/**
 * Encapsulates Exchange Adapter config management.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [ExchangeRxComponent, ExchangeAdapterComponent],
    declarations: [ExchangeRxComponent, ExchangeAdapterComponent]
})
export class ExchangeAdapterModule {
}
