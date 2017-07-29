import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EngineComponent} from './engine.component';

/**
 * Encapsulates Engine config management.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule,
        ReactiveFormsModule
    ],
    exports: [EngineComponent],
    declarations: [EngineComponent]
})
export class EngineModule {
}
