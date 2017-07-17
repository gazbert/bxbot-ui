import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from './shared/authentication.service';

/**
 * The main app component.
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
                <a id="settingsButton">Settings</a>
                <a id="logoutButton" class="logout-btn" routerLink="/login" routerLinkActive="active" *ngIf="isLoggedIn()">Logout</a>
            </nav>
            <router-outlet></router-outlet>
        </div>
    `
})
export class AppComponent {

    // public static REST_API_BASE_URL = 'http://localhost:8080/api/';        // URL to real server
    public static REST_API_BASE_URL = 'app/';                           // URL to in-memory web API

    title = 'BX-bot Admin Console';

    constructor(private authenticationService: AuthenticationService) {
    }

    isLoggedIn(): boolean {
        return this.authenticationService.isLoggedIn();
    }
}
