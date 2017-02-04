import {Component} from '@angular/core';

/**
 * The main app component provides the landing page - currently the Dashboard.
 *
 * @author gazbert
 */
@Component({
    selector: 'bxbot-ui',
    template: `
    <div class="container module-bootstrap">
        <h1>{{title}}</h1>
        <nav>
            <a id="dashboardButton" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <!--<a id="settingsButton" routerLink="/settings" routerLinkActive="active">Settings</a>      -->
        </nav>
        <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
    title = 'BX-bot Admin Console';
}
