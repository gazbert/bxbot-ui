import {Component} from "@angular/core";

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
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>         
        </nav>
        <router-outlet></router-outlet>
    </div>
  `,
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    title = 'BX-bot Admin Console';
}