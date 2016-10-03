import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/index";
import {EmailAlertsComponent} from "./email-alerts/index";
import {ExchangeDetailsComponent} from "./exchange-details/index";

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
        component: ExchangeDetailsComponent
    },
    {
        path: 'emailalerts',
        component: EmailAlertsComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
