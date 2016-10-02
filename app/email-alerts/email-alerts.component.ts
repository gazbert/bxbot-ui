import {Component, OnInit} from "@angular/core";
import {Router} from "@angular/router";
import {EmailAlertsConfig} from "./email-alerts.model";

/**
 * Email Alerts config component.
 */
@Component({
    moduleId: module.id,
    selector: 'bx-email-alerts',
    templateUrl: './email-alerts.component.html',
    styleUrls: ['../exchange/exchange-detail.component.css']
})
export class EmailAlertsComponent implements OnInit {

    public emailAlerts: EmailAlertsConfig;

    constructor(private router: Router) {
    }

    ngOnInit() {
        this.emailAlerts = {
            alertsEnabled: false,
            username: '',
            password: '',
            confirmPassword: '',
            toAddress: '',
            fromAddress: ''
        }
    }

    save(model: EmailAlertsConfig, isValid: boolean) {
        // call API to save email alert config
        console.log(model, isValid);
    }

    goBack(): void {
        window.history.back();
        // this.router.navigate(['/dashboard']);
    }
}
