import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard/dashboard.component';
import {LoginComponent} from './login';
import {CanActivateAuthGuard} from './shared';
// import {SettingsComponent} from './settings.component';

/**
 * Main routing module for the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            {path: 'login', component: LoginComponent},
            {path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateAuthGuard]},
            // {path: 'settings', component: SettingsComponent, canActivate: [CanActivateAuthGuard]},
            {
                path: 'exchange',
                loadChildren: 'app/exchange-details/exchange-details.module#ExchangeDetailsModule',
                canActivate: [CanActivateAuthGuard]
            }
        ])
    ],
    exports: [RouterModule] // re-export the module declarations
})
export class AppRoutingModule {
}
