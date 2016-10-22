import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {InMemoryWebApiModule} from "angular-in-memory-web-api";
import {AppComponent} from "./app.component";
import {ExchangeHttpDataPromiseService, ExchangeHttpDataObservableService, InMemoryDataService} from "./model";
import {DashboardModule} from "./dashboard/dashboard.module";
import {ExchangeDetailsModule} from "./exchange-details/exchange-details.module";
import {ExchangeAdapterModule} from "./exchange-adapter/exchange-adapter.module";
import {EmailAlertsModule} from "./email-alerts/email-alerts.module";
import {AppRoutingModule} from "./app-routing.module";

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
        DashboardModule,
        ExchangeAdapterModule,
        EmailAlertsModule,
        ExchangeDetailsModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [ExchangeHttpDataPromiseService, ExchangeHttpDataObservableService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
