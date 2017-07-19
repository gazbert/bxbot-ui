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
    botId;
    active = true;

    @ViewChild('emailAlertsForm') currentForm: NgForm;
    emailAlertsForm: NgForm;

    formErrors = {};

    validationMessages = {
        'accountUsername': {
            'required': 'Account Username is required.',
            'maxlength': 'Account Username max length is 50 characters.',
            'pattern': 'Account Username must be alphanumeric and can only include the following special characters: _ -',
        },
        'password': {
            'required': 'Account Password is required.',
            'maxlength': 'Account Password max length is 50 characters.',
            'pattern': 'Account Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $',
            'validateEqual': 'Passwords must match.'
        },
        'confirmPassword': {
            'required': 'Please retype Account Password.',
            'maxlength': 'Account Password max length is 50 characters.',
            'pattern': 'Account Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $',
            'validateEqual': 'Passwords must match.'
        },
        'toAddress': {
            'required': 'To Address is required.',
            'maxlength': 'To Address max length is 50 characters.',
            'pattern': 'Valid email To Address is required, e.g. solo@falcon.com'
        },
        'fromAddress': {
            'required': 'From Address is required.',
            'maxlength': 'From Address max length is 50 characters.',
            'pattern': 'Valid email From Address is required, e.g. boba@hoth.com'
        }
    };

    constructor(private emailAlertsService: EmailAlertsHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.botId = params['id'];
            this.emailAlertsService.getEmailAlertsConfigByBotId(this.botId)
                .then(emailAlertsConfig => {
                    this.emailAlertsConfig = emailAlertsConfig;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.emailAlertsService.updateEmailAlertsConfig(this.emailAlertsConfig)
                .then((updatedConfig) => {
                    this.emailAlertsConfig = updatedConfig;
                    this.goToDashboard();
                });
        } else {
            this.onValueChanged(); // force validation for new untouched strats
        }
    }

    cancel() {
        this.goToDashboard();
    }

    goToDashboard(): void {
        this.router.navigate(['dashboard']);
    }

    updateFormErrors(): void {
        this.formErrors['accountUsername'] = '';
        this.formErrors['password'] = '';
        this.formErrors['confirmPassword'] = '';
        this.formErrors['toAddress'] = '';
        this.formErrors['fromAddress'] = '';
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------

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

                // 1st condition validates user update to email config; 2nd condition validates untouched email config
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.emailAlertsForm.submitted)) {
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
