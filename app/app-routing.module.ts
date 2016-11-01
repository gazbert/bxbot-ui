import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
// import {AboutComponent} from "./about.component";
// import {SettingsComponent} from "./settings.component";

/**
 * Main routing module for the app.
 *
 * @author gazbert
 */
@NgModule({
    imports: [
        RouterModule.forRoot([
            {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
            // {path: 'about', component: AboutComponent},
            // {path: 'settings', component: SettingsComponent},
            {path: 'exchange', loadChildren: 'app/exchange-details/exchange-details.module#ExchangeDetailsModule'}
        ])
    ],
    exports: [RouterModule] // re-export the module declarations
})
export class AppRoutingModule {
}
