import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {MarketsComponent} from './markets.component';
import {SharedModule} from '../shared/shared.module';

/**
 * Encapsulates Market config management.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule,
        SharedModule
    ],
    exports: [MarketsComponent],
    declarations: [MarketsComponent]
})
export class MarketsModule {
}
