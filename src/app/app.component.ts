import {Component} from '@angular/core';
import {AuthenticationService} from './shared';

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

    isLoggedIn(): boolean {
        return AuthenticationService.isLoggedIn();
    }

    getTitle() {
        return AppComponent.TITLE;
    }
}
