import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {EmailAlertsComponent} from './email-alerts.component';
import {EqualValidatorDirective} from './equal-validator.directive';

/**
 * Encapsulates Email Alerts config management.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule
    ],
    exports: [EmailAlertsComponent, EqualValidatorDirective],
    declarations: [EmailAlertsComponent, EqualValidatorDirective]
})
export class EmailAlertsModule {
}
