import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/index";
import {ExchangeDetailComponent, ExchangeDetailRxComponent} from "./exchange/index";
import {EmailAlertsComponent} from "./email-alerts/index";

const appRoutes: Routes = [
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'detail/:id',
        // component: ExchangeDetailComponent
        component: ExchangeDetailRxComponent
    },
    {
        path: 'emailalerts',
        component: EmailAlertsComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
