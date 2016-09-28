import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule}    from '@angular/http';

// Imports for loading & configuring the in-memory web api
import {InMemoryWebApiModule} from 'angular2-in-memory-web-api';
import {InMemoryDataService}  from './shared/in-memory-data.service';

import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {ExchangeRestClientService} from "./shared/index";
import {DashboardComponent} from "./dashboard/index";
import {ExchangeDetailComponent} from "./exchange/index";

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, InMemoryWebApiModule.forRoot(InMemoryDataService), routing],
    declarations: [AppComponent, DashboardComponent, ExchangeDetailComponent],
    providers: [ExchangeRestClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
