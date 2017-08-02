import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {SettingsComponent} from './settings.component';

/**
 * Encapsulates Settings for the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule
    ],
    exports: [SettingsComponent],
    declarations: [SettingsComponent]
})
export class SettingsModule {
}
