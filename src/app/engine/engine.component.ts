import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Engine, EngineHttpDataPromiseService} from '../model/engine';
import {BotHttpDataObservableService} from '../model/bot';

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

    constructor(private engineDataService: EngineHttpDataPromiseService,
                private botDataService: BotHttpDataObservableService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const botId = params['id'];
            this.engineDataService.getEngineByBotId(botId)
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
            this.engineDataService.update(this.engine)
                .then(() => {
                    this.botDataService.getBot(this.engine.id).subscribe((bot) => {
                            bot.name = this.engine.botName;
                            this.botDataService.update(bot).toPromise()
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
        this.formErrors['tradingCycleInterval'] = '';
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

