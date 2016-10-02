import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule}    from '@angular/http';
import {ReactiveFormsModule} from '@angular/forms';

// Imports for loading & configuring the in-memory web api
import {InMemoryWebApiModule} from 'angular2-in-memory-web-api';
import {InMemoryDataService}  from './shared/in-memory-data.service';

import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {ExchangeRestClientService} from "./shared/index";
import {DashboardComponent} from "./dashboard/index";
import {ExchangeDetailComponent, ExchangeDetailRxComponent} from "./exchange/index";
import {EmailAlertsComponent, EqualValidator} from "./email-alerts/index";

@NgModule({
    imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpModule, InMemoryWebApiModule.forRoot(InMemoryDataService), routing],
    declarations: [AppComponent, DashboardComponent, ExchangeDetailComponent, ExchangeDetailRxComponent, EmailAlertsComponent, EqualValidator],
    providers: [ExchangeRestClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
