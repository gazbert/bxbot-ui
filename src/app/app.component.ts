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
     */
    public static AUTH_ENDPOINT_BASE_URL = 'http://localhost:8080';

    /**
     * Base URL to bxbot-ui-server REST API runtime endpoints.
     * Uncomment this to use the 'real' backend.
     */
    // public static REST_API_RUNTIME_BASE_URL = 'http://localhost:8080/api/v1/runtime/bots';

    /**
     * Base URL to bxbot-ui-server REST API config endpoints.
     * Uncomment this to use the 'real' backend.
     */
    // public static REST_API_RUNTIME_BASE_URL = 'http://localhost:8080/api/v1/config/bots';

    /**
     * Base URL to Angular's in-memory web API endpoints.
     * Uncomment this to use for dev/testing/demos.
     */
    public static REST_API_RUNTIME_BASE_URL = 'app';

    /**
     * Base URL to Angular's in-memory web API endpoints.
     * Uncomment this to use for dev/testing/demos.
     */
    public static REST_API_CONFIG_BASE_URL = 'app';


    isLoggedIn(): boolean {
        return AuthenticationService.isLoggedIn();
    }

    getTitle() {
        return AppComponent.TITLE;
    }
}
