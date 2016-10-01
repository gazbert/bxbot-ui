import {ModuleWithProviders} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";
import {DashboardComponent} from "./dashboard/index";
import {ExchangeDetailComponent, ExchangeDetailRxComponent} from "./exchange/index";

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
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
