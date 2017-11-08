import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './model';
import {BotHttpDataObservableService} from './model/bot-status';
import {ExchangeAdapterHttpDataObservableService} from './model/exchange-adapter';
import {ExchangeAdapterHttpDataPromiseService} from './model/exchange-adapter/promise';
import {MarketHttpDataService} from './model/market';
import {DashboardModule} from './dashboard/dashboard.module';
import {BotDetailsModule} from './bot-details/bot-details.module';
import {ExchangeAdapterModule} from './exchange-adapter/exchange-adapter.module';
import {EmailAlertsModule} from './email-alerts/email-alerts.module';
import {AppRoutingModule} from './app-routing.module';
import {EmailAlertsHttpDataPromiseService} from './model/email-alerts';
import {EngineHttpDataService} from './model/engine';
import {StrategiesModule} from './strategies/strategies.module';
import {StrategyHttpDataService} from './model/strategy/strategy-http-data.service';
import {LoginModule} from './login/login.module';
import {AuthenticationService, CanActivateAuthGuard} from './shared';
import {EngineModule} from './engine/engine.module';
import {SettingsModule} from './settings/settings.module';

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

        // Comment line below out to use 'real' bxbot-ui-server Spring Boot backend
        InMemoryWebApiModule.forRoot(InMemoryDataService,  {put204: false, delete404: true}),

        DashboardModule,
        ExchangeAdapterModule,
        EmailAlertsModule,
        BotDetailsModule,
        StrategiesModule,
        EngineModule,
        AppRoutingModule,
        LoginModule,
        SettingsModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        BotHttpDataObservableService,
        ExchangeAdapterHttpDataPromiseService,
        ExchangeAdapterHttpDataObservableService,
        MarketHttpDataService,
        StrategyHttpDataService,
        EmailAlertsHttpDataPromiseService,
        EngineHttpDataService,
        AuthenticationService,
        CanActivateAuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
