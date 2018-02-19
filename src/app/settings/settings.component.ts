import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {BotConfig, BotConfigHttpDataService} from '../model/bot-config';

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

    bots: BotConfig[] = [];
    deletedBots: BotConfig[] = [];
    botId;
    active = true;

    botsForm: NgForm;
    @ViewChild('botsForm') currentForm: NgForm;

    formErrors = {};

    validationMessages = {
        'botId': {
            'required': 'Bot Id is required.',
            'maxlength': 'Bot Id max length is 50 characters.',
            'pattern': 'Bot Id must be alphanumeric and can only include the following special characters: _ -',
            'duplicateId': 'Bot Id already in use. Please choose another.'
        },
        'name': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -',
            'duplicateName': 'Name already in use. Please choose another.'
        },
        'baseUrl': {
            'required': 'Base URL is required.',
            'maxlength': 'Base URL max length is 100 characters.',
            'pattern': 'Base URL must be alphanumeric and can only include the following special characters: _ -',
            'duplicateId': 'Bot Id already in use. Please choose another.'
        },
        'username': {
            'required': 'Username is required.',
            'maxlength': 'Username max length is 50 characters.',
            'pattern': 'Username must be alphanumeric and can only include the following special characters: _ -'
        },
        'password': {
            'required': 'Password is required.',
            'maxlength': 'Password max length is 50 characters.',
            'pattern': 'Password must be alphanumeric and can only include the following special characters: / _ - , . @ £ $'
        }
    };

    constructor(private botConfigDataService: BotConfigHttpDataService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            // this.botId = params['id'];
            this.botConfigDataService.getAllBotConfig()
                .then(bots => {
                    this.bots = bots;
                    this.updateFormErrors();
                });
        }).then(() => {/*done*/});
    }

    addBot(): void {
        this.bots.push(new BotConfig(null, null, null, null, null));
        this.updateFormErrors();
    }

    deleteBot(bot: BotConfig): void {
        // this.marketDataService.getAllMarketsForBotId(this.botId)
        //     .then((markets) => {
        //         const marketsUsingTheStrategy = markets.filter(m => m.strategy.id === strategy.id);
        //         if (marketsUsingTheStrategy.length > 0) {
        //             this.showCannotDeleteStrategyModal();
        //         } else {
        //             this.bots = this.bots.filter(s => s.id !== strategy.id);
        //             this.deletedBots.push(strategy);
        //             this.updateFormErrors();
        //         }
        //     });
    }

    save(isValid: boolean): void {
        if (isValid) {
            this.deletedBots.forEach((bot) => {
                this.botConfigDataService.deleteBotConfigById(this.botId).then(() => {/*done*/
                });
            });

            // TODO - Be more efficient: only update Bots that have changed
            this.bots.forEach((bot) => {
                this.botConfigDataService.updateBotConfig(bot.id, bot)
                    .then(() => this.goToDashboard());
            });
        } else {
            this.onValueChanged(); // force validation for new untouched bots
        }
    }

    cancel() {
        this.goToDashboard();
    }

    goToDashboard() {
        this.router.navigate(['dashboard']);
    }

    canBeDeleted() {
        return this.bots.length > 1;
    }

    // TODO - Only here temporarily for use with angular-in-memory-web-api until server side wired up.
    // Server will create UUID and return in POST response object.
    // Algo by @Broofa - http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript/2117523#2117523
    createUuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            // tslint:disable-next-line
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    updateFormErrors(): void {
        for (let i = 0; i < this.bots.length; i++) {
            this.formErrors['botId_' + i] = '';
            this.formErrors['name_' + i] = '';
            this.formErrors['baseUrl_' + i] = '';
            this.formErrors['username_' + i] = '';
            this.formErrors['password_' + i] = '';
        }
    }

    /**
     * Need this because we iterate over primitive arrays for errorCode and errorMessage:
     * https://stackoverflow.com/questions/42322968/angular2-dynamic-input-field-lose-focus-when-input-changes
     */
    trackByIndex(index: any, item: any) {
        return index;
    }

    // ------------------------------------------------------------------------
    // Form validation
    // TODO - Move into new shared validation component
    // ------------------------------------------------------------------------

    ngAfterViewChecked() {
        this.formChanged();
    }

    formChanged() {

        if (this.currentForm === this.botsForm) {
            return;
        }

        this.botsForm = this.currentForm;
        if (this.botsForm) {
            this.botsForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.botsForm) {
            return;
        }

        const form = this.botsForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.botsForm.submitted)) {
                    const messages = this.validationMessages[field.substring(0, field.indexOf('_'))];
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
