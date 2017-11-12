import {OnInit, Component, ViewChild, AfterViewChecked} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Exchange, ConfigItem} from '../model/exchange';
import {ExchangeHttpDataPromiseService} from '../model/exchange/promise';

/**
 * Template-driven version of the Exchange form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-exchange',
    templateUrl: 'exchange.component.html',
    styleUrls: ['exchange.component.css']
})
export class ExchangeComponent implements OnInit, AfterViewChecked {

    exchange: Exchange;
    active = true;

    @ViewChild('exchangeForm') currentForm: NgForm;
    exchangeForm: NgForm;

    formErrors = {};

    validationMessages = {
        'exchangeName': {
            'required': 'Exchange Name is required.',
            'maxlength': 'Exchange Name max length is 50 characters.',
            'pattern': 'Exchange Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'className': {
            'required': 'Class Name is required.',
            'maxlength': 'Class Name max length is 120 characters.',
            'pattern': 'Class Name must be valid Java class, e.g. com.my.MyExchangeAdapterClass'
        },
        'connectionTimeout': {
            'required': 'Connection timeout is required.',
            'pattern': 'Connection timeout must be a whole number.'
        },
        'errorCode': {
            'required': 'Connection timeout is required.',
            'pattern': 'HTTP Status Code must be a 3 digit number.'
        },
        'errorMessage': {
            'required': 'Error message must not be empty.'
        },
        'exchangeConfigItemName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'exchangeConfigItemValue': {
            'required': 'Value is required.',
            'maxlength': 'Value max length is 120 characters.'
        }
    };

    constructor(private exchangeDataService: ExchangeHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const botId = params['id'];
            this.exchangeDataService.getExchangeByBotId(botId)
                .then(exchange => {
                    this.exchange = exchange;
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
            this.exchangeDataService.updateExchange(this.exchange)
                .then(() => this.goToDashboard());
        } else {
            this.onValueChanged(); // force validation for new untouched error codes/messages
        }
    }

    addErrorCode(): void {
        this.exchange.networkConfig.nonFatalHttpStatusCodes.push(null);
        this.updateFormErrors();
    }

    deleteErrorCode(code: number): void {
        this.exchange.networkConfig.nonFatalHttpStatusCodes =
            this.exchange.networkConfig.nonFatalHttpStatusCodes.filter(c => c !== code);
        this.updateFormErrors();
    }

    addErrorMessage(): void {
        this.exchange.networkConfig.nonFatalErrorMessages.push('');
        this.updateFormErrors();
    }

    deleteErrorMessage(message: string): void {
        this.exchange.networkConfig.nonFatalErrorMessages =
            this.exchange.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
        this.updateFormErrors();
    }

    addOptionalConfigItem(): void {
        this.exchange.optionalConfig.configItems.push(new ConfigItem('', ''));
        this.updateFormErrors();
    }

    deleteOptionalConfigItem(configItem: ConfigItem): void {
        this.exchange.optionalConfig.configItems =
            this.exchange.optionalConfig.configItems.filter(c => c !== configItem);
        this.updateFormErrors();
    }

    updateFormErrors(): void {
        this.formErrors['exchangeName'] = '';
        this.formErrors['className'] = '';
        this.formErrors['connectionTimeout'] = '';

        for (let i = 0; i < this.exchange.networkConfig.nonFatalHttpStatusCodes.length; i++) {
            this.formErrors['errorCode_' + i] = '';
        }
        for (let i = 0; i < this.exchange.networkConfig.nonFatalErrorMessages.length; i++) {
            this.formErrors['errorMessage_' + i] = '';
        }

        for (let i = 0; i < this.exchange.optionalConfig.configItems.length; i++) {
            this.formErrors['exchangeConfigItemName_' + i] = '';
            this.formErrors['exchangeConfigItemValue_' + i] = '';
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

        if (this.currentForm === this.exchangeForm) {
            return;
        }

        this.exchangeForm = this.currentForm;
        if (this.exchangeForm) {
            this.exchangeForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.exchangeForm) {
            return;
        }

        const form = this.exchangeForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.exchangeForm.submitted)) {

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
