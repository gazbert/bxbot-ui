import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {InMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemoryDataService} from "./shared/in-memory-data.service";

import {AppComponent} from "./app.component";
import {routing} from "./app.routing";
import {ExchangeRestClientService} from "./shared/index";
import {DashboardComponent} from "./dashboard/index";
import {ExchangeAdapterComponent, ExchangeAdapterRxComponent} from "./exchange-adapter/index";
import {EmailAlertsComponent, EqualValidator} from "./email-alerts/index";
import {ExchangeDetailsComponent, Tabs, Tab} from "./exchange-details/index";

/**
 * BX-bot UI main module.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpModule,
        InMemoryWebApiModule.forRoot(InMemoryDataService),
        routing
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ExchangeAdapterComponent,
        ExchangeAdapterRxComponent,
        EmailAlertsComponent,
        EqualValidator,
        ExchangeDetailsComponent,
        Tabs,
        Tab
    ],
    providers: [ExchangeRestClientService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
