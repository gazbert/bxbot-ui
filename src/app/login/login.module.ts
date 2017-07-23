import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';

/**
 * The Login module.
 * It provides the login screen for the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule, // must have this if we do anything with *ngFor, *ngIf etc
        FormsModule,
        SharedModule
    ],
    exports: [LoginComponent],
    declarations: [LoginComponent]
})
export class LoginModule {
}
