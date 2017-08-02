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
                <a id="dashboardButton" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
                <a id="settingsButton" routerLink="/settings" routerLinkActive="active">Settings</a>
                <a id="logoutButton" class="logout-btn" routerLink="/login" routerLinkActive="active"
                   *ngIf="isLoggedIn()">Logout</a>
            </nav>
            <router-outlet></router-outlet>
        </div>`
})
export class AppComponent {

    public static TITLE = 'BX-bot Admin Console';

    /**
     * Base URL to real server's authentication endpoint.
     * This is ignored when using in-memory web API.
     */
    public static AUTH_ENDPOINT_BASE_URL = 'http://localhost:8080';

    /**
     * Base URL to real server's REST API endpoints.
     * Uncomment this to use the 'real' backend.
     */
    // public static REST_API_BASE_URL = 'http://localhost:8080/api';

    /**
     * Base URL to Angular's in-memory web API endpoints.
     * Uncomment this to use for dev/testing/demos.
     */
    public static REST_API_BASE_URL = 'app';


    isLoggedIn(): boolean {
        return AuthenticationService.isLoggedIn();
    }

    getTitle() {
        return AppComponent.TITLE;
    }
}
