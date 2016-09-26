import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule}    from '@angular/http';

// Imports for loading & configuring the in-memory web api
import {InMemoryWebApiModule} from 'angular2-in-memory-web-api';
import {InMemoryDataService}  from './shared/in-memory-data.service';

import {AppComponent} from "./app.component";
import {ExchangeRestClientService} from "./shared/exchange-rest-client.service";
import {routing} from "./app.routing";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ExchangeDetailComponent} from "./exchange/exchange-detail.component";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, InMemoryWebApiModule.forRoot(InMemoryDataService), routing],
    declarations: [AppComponent, DashboardComponent, ExchangeDetailComponent],
    providers: [ExchangeRestClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}