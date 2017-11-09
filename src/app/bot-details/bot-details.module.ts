import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {BotDetailsComponent} from './bot-details.component';
import {TabsComponent, TabComponent} from './tabs/';
import {ExchangeAdapterModule} from '../exchange/exchange-adapter.module';
import {MarketsModule} from '../markets/markets.module';
import {EmailAlertsModule} from '../email-alerts/email-alerts.module';
import {SharedModule} from '../shared/shared.module';
import {StrategiesModule} from '../strategies/strategies.module';
import {EngineModule} from '../engine/engine.module';

const routes: Routes = [
    {
        path: 'bot/:id', component: BotDetailsComponent
    }
];

/**
 * Container module for holding the bot's config and status screens.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule,
        ExchangeAdapterModule,
        EmailAlertsModule,
        MarketsModule,
        StrategiesModule,
        EngineModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [BotDetailsComponent, TabComponent, TabsComponent]
})
export class BotDetailsModule {
}
