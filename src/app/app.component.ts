import {Component} from '@angular/core';
import {AuthenticationService} from './shared/authentication.service';

/**
 * The main app component.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui',
    template: `
        <div class="container module-bootstrap">
            <h1>{{getTitle()}}</h1>
            <nav>
                <a id="dashboardButton" routerLink="/dashboard" routerLinkActive="active">
                    <i class="glyphicon glyphicon-th pull-left glyphicon-padding"></i>
                    Dashboard
                </a>
                <a id="settingsButton" routerLink="/settings" routerLinkActive="active">
                    <i class="glyphicon glyphicon-cog pull-left glyphicon-padding"></i>
                    Settings
                </a>
                <a id="logoutButton" class="logout-btn" routerLink="/login" routerLinkActive="active" *ngIf="isLoggedIn()">
                    <i class="glyphicon glyphicon-log-out pull-left glyphicon-padding"></i>
                    Logout
                </a>
            </nav>
            <router-outlet></router-outlet>
        </div>`
})
export class AppComponent {

    public static TITLE = 'BX-bot Admin Console';

    /**
     * Base URL to bxbot-ui-server authentication endpoint.
     * This is ignored when using in-memory web API.
     * TODO - Move to environment file
     */
    public static AUTH_ENDPOINT_BASE_URL = 'http://localhost:8080';

    isLoggedIn(): boolean {
        return AuthenticationService.isLoggedIn();
    }

    getTitle() {
        return AppComponent.TITLE;
    }
}
