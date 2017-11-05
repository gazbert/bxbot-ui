import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

/**
 * Template-driven version of the Settings form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-settings',
    templateUrl: 'settings.component.html',
    styleUrls: ['settings.component.css']
})
export class SettingsComponent implements OnInit, AfterViewChecked {

    uiVersion: string;
    active = true;

    @ViewChild('settingsForm') currentForm: NgForm;
    settingsForm: NgForm;

    formErrors = {};

    validationMessages = {
        'botName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'tradingCycleInterval': {
            'required': 'Trading Cycle Interval is required.',
            'pattern': 'Trading Cycle Interval must be a whole number.'
        },
        'emergencyStopCurrency': {
            'required': 'Emergency Stop Currency is required.',
            'pattern': 'Emergency Stop Currency must be valid 3 character currency id, e.g. BTC'
        },
        'emergencyStopBalance': {
            'required': 'Emergency Stop Balance is required.',
            'pattern': 'Emergency Stop Balance must be a decimal number.'
        },
    };

    private errorMessage: string;

    constructor(private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {

        // hack for now ;-)
        this.uiVersion = '0.0.1';
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    save(isValid: boolean): void {
    }

    cancel() {
        this.goToDashboard();
    }

    updateFormErrors(): void {
        this.formErrors['botName'] = '';
        this.formErrors['tradeCycleInterval'] = '';
        this.formErrors['emergencyStopCurrency'] = '';
        this.formErrors['emergencyStopBalance'] = '';
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {

        if (this.currentForm === this.settingsForm) {
            return;
        }

        this.settingsForm = this.currentForm;
        if (this.settingsForm) {
            this.settingsForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.settingsForm) {
            return;
        }

        const form = this.settingsForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.settingsForm.submitted)) {

                    let messages;
                    if (field.indexOf('_') === -1) {
                        messages = this.validationMessages[field];
                    } else {
                        // for multiple error codes and messages
                        messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
                    }

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
