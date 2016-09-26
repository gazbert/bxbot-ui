import {Component} from "@angular/core";

@Component({
    selector: 'bxbot-ui',
    template: `
    <h1>{{title}}</h1>
    <nav>
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>       
    </nav>
    <router-outlet></router-outlet>
  `,
    styleUrls: ['app/app.component.css']
})
export class AppComponent {
    title = 'BX-bot Admin Console';
}