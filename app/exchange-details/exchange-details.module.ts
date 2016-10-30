import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {BrowserModule} from '@angular/platform-browser';
import {ExchangeDetailsComponent} from './exchange-details.component';
import {TabComponent} from './tab.component';
import {TabsComponent} from './tabs.component';
import {ExchangeAdapterModule} from '../exchange-adapter/exchange-adapter.module';
import {EmailAlertsModule} from '../email-alerts/email-alerts.module';
import {SharedModule} from '../shared/shared.module';

const routes: Routes = [
    {
        path: 'exchange/:id', component: ExchangeDetailsComponent
    }
];

/**
 * Provides the container for all the configuration panels.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        BrowserModule,
        ExchangeAdapterModule,
        EmailAlertsModule,
        SharedModule,
        RouterModule.forChild(routes),
    ],
    declarations: [ExchangeDetailsComponent, TabComponent, TabsComponent]
})
export class ExchangeDetailsModule {
}
