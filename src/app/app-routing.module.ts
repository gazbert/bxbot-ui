import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard';
import {LoginComponent} from './login';
import {CanActivateAuthGuard} from './shared';
import {SettingsComponent} from './settings';

/**
 * Main routing module for the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
            {path: 'dashboard', component: DashboardComponent, canActivate: [CanActivateAuthGuard]},
            {path: 'login', component: LoginComponent},
            {path: 'logout', component: LoginComponent},
            {
                path: 'bot',
                loadChildren: 'app/bot-details/bot-details.module#BotDetailsModule',
                canActivate: [CanActivateAuthGuard]
            },
            {path: 'settings', component: SettingsComponent, canActivate: [CanActivateAuthGuard]},
        ])
    ],
    exports: [RouterModule] // re-export the module declarations
})
export class AppRoutingModule {
}
