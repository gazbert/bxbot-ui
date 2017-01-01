import {OnInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {EmailAlertsConfig, EmailAlertsHttpDataPromiseService} from '../model/email-alerts';

/**
 * Template-driven version of the Email Alerts config form.
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-email-alerts',
    templateUrl: 'email-alerts.component.html',
    styleUrls: ['email-alerts.component.css']
})
export class EmailAlertsComponent implements OnInit {

    emailAlertsConfig: EmailAlertsConfig;
    exchangeId;
    active = true;

    @ViewChild('emailAlertsForm') currentForm: NgForm;
    emailAlertsForm: NgForm;

    // TODO add email alert stuff in here
    formErrors = {
        'accountUsername': '',
        'toAddress': ''
        // etc...
    };

    validationMessages = {
        'accountUsername': {
            'required': 'Username is required.',
            'maxlength': 'Username cannot be more than 8 characters long.'
        },
        'toAddress': {
            'required': 'Email To Address is required.',
            'pattern': ' Email To Address is required and format should be: boba@fett.com'
        }
    };

    constructor(private emailAlertsService: EmailAlertsHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.exchangeId = params['id'];
            this.emailAlertsService.getEmailAlertsConfigForExchange(this.exchangeId)
                .then(emailAlertsConfig => this.emailAlertsConfig = emailAlertsConfig);
        });
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.emailAlertsService.updateEmailAlertsConfig(this.emailAlertsConfig)
                .then((updatedConfig) => {
                    this.emailAlertsConfig = updatedConfig;
                    this.goToDashboard();
                });
        }
    }

    goToDashboard(): void {
        this.router.navigate(['/dashboard']);
    }

    // ------------------------------------------------------------------
    // TODO Form validation
    // ------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {
        if (this.currentForm === this.emailAlertsForm) {
            return;
        }
        this.emailAlertsForm = this.currentForm;
        if (this.emailAlertsForm) {
            this.emailAlertsForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {
        if (!this.emailAlertsForm) {
            return;
        }
        const form = this.emailAlertsForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                if (control && control.dirty && !control.valid) {
                    const messages = this.validationMessages[field];
                    for (const key in control.errors) {
                        if (control.errors.hasOwnProperty(key)) {
                            this.formErrors[field] += messages[key] + ' ';
                        }
                    }
                }
            }
        }
    }
}
