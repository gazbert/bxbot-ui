import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {ExchangeAdapterRxComponent} from './rx/exchange-adapter-rx.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ExchangeAdapterComponent} from './exchange-adapter.component';

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
    exports: [ExchangeAdapterRxComponent, ExchangeAdapterComponent],
    declarations: [ExchangeAdapterRxComponent, ExchangeAdapterComponent]
})
export class ExchangeAdapterModule {
}
