import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {InMemoryWebApiModule} from 'angular-in-memory-web-api';
import {InMemoryDataService} from './model';
import {BotStatusHttpDataService} from './model/bot-status';
import {ExchangeHttpDataObservableService} from './model/exchange';
import {ExchangeHttpDataPromiseService} from './model/exchange/promise';
import {MarketHttpDataService} from './model/market';
import {DashboardModule} from './dashboard/dashboard.module';
import {BotDetailsModule} from './bot-details/bot-details.module';
import {ExchangeModule} from './exchange/exchange.module';
import {EmailAlertsModule} from './email-alerts/email-alerts.module';
import {AppRoutingModule} from './app-routing.module';
import {EmailAlertsHttpDataService} from './model/email-alerts';
import {EngineHttpDataService} from './model/engine';
import {StrategiesModule} from './strategies/strategies.module';
import {StrategyHttpDataService} from './model/strategy';
import {LoginModule} from './login/login.module';
import {AuthenticationService, CanActivateAuthGuard} from './shared';
import {EngineModule} from './engine/engine.module';
import {SettingsModule} from './settings/settings.module';
import {MarketsModule} from './markets/markets.module';

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
        HttpClientModule,

        // Comment line below out to use 'real' bxbot-ui-server Spring Boot backend
        InMemoryWebApiModule.forRoot(InMemoryDataService,  {put204: false, delete404: true}),

        DashboardModule,
        ExchangeModule,
        EmailAlertsModule,
        BotDetailsModule,
        StrategiesModule,
        MarketsModule,
        EngineModule,
        AppRoutingModule,
        LoginModule,
        SettingsModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        BotStatusHttpDataService,
        ExchangeHttpDataPromiseService,
        ExchangeHttpDataObservableService,
        MarketHttpDataService,
        StrategyHttpDataService,
        EmailAlertsHttpDataService,
        EngineHttpDataService,
        AuthenticationService,
        CanActivateAuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
