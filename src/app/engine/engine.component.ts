import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Engine, EngineHttpDataService} from '../model/engine';
import {BotStatusHttpDataService} from '../model/bot-status';

/**
 * Template-driven version of the Engine form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-engine',
    templateUrl: 'engine.component.html',
    styleUrls: ['engine.component.css']
})
export class EngineComponent implements OnInit, AfterViewChecked {

    botId: string;
    engine: Engine;
    active = true;

    @ViewChild('engineForm') currentForm: NgForm;
    engineForm: NgForm;

    formErrors = {};

    validationMessages = {
        'botName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'tradeCycleInterval': {
            'required': 'Trade Cycle Interval is required.',
            'pattern': 'Trade Cycle Interval must be a whole number.'
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

    constructor(private engineDataService: EngineHttpDataService,
                private botStatusDataService: BotStatusHttpDataService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            this.botId = params['id'];
            this.engineDataService.getEngineByBotId(this.botId)
                .then(engine => {
                    this.engine = engine;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    cancel() {
        this.goToDashboard();
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.engineDataService.updateEngine(this.botId, this.engine)
                .then(() => {
                    this.botStatusDataService.getBotStatusById(this.engine.id).subscribe((bot) => {
                            bot.name = this.engine.botName;
                            this.botStatusDataService.updateBotStatus(bot).toPromise()
                                .then(() => this.goToDashboard());
                        },
                        error => this.errorMessage = <any>error); // TODO - Show meaningful error to user?
                });
        } else {
            this.onValueChanged(); // force validation for new/untouched fields
        }
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

        if (this.currentForm === this.engineForm) {
            return;
        }

        this.engineForm = this.currentForm;
        if (this.engineForm) {
            this.engineForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.engineForm) {
            return;
        }

        const form = this.engineForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.engineForm.submitted)) {

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

