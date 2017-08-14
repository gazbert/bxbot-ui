import {OnInit, Component, ViewChild, AfterViewChecked} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ExchangeAdapter} from '../model/exchange-adapter';
import {ExchangeAdapterHttpDataPromiseService} from '../model/exchange-adapter/promise';
import {ConfigItem} from '../model/exchange-adapter/exchange-adapter.model';

/**
 * Template-driven version of the Exchange Adapter form.
 *
 * @author gazbert
 */
@Component({
    selector: 'app-bxbot-ui-exchange-adapter',
    templateUrl: 'exchange-adapter.component.html',
    styleUrls: ['exchange-adapter.component.css']
})
export class ExchangeAdapterComponent implements OnInit, AfterViewChecked {

    exchangeAdapter: ExchangeAdapter;
    active = true;

    @ViewChild('exchangeAdapterForm') currentForm: NgForm;
    exchangeAdapterForm: NgForm;

    formErrors = {};

    validationMessages = {
        'adapterName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
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
        'configItemName': {
            'required': 'Name is required.',
            'maxlength': 'Name max length is 50 characters.',
            'pattern': 'Name must be alphanumeric and can only include the following special characters: _ -'
        },
        'configItemValue': {
            'required': 'Value is required.',
            'maxlength': 'Value max length is 120 characters.'
        }
    };

    constructor(private exchangeAdapterDataService: ExchangeAdapterHttpDataPromiseService, private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            const botId = params['id'];
            this.exchangeAdapterDataService.getExchangeAdapterByBotId(botId)
                .then(exchangeAdapter => {
                    this.exchangeAdapter = exchangeAdapter;
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
            this.exchangeAdapterDataService.update(this.exchangeAdapter)
                .then(() => this.goToDashboard());
        } else {
            this.onValueChanged(); // force validation for new untouched error codes/messages
        }
    }

    addErrorCode(): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.push(null);
        this.updateFormErrors();
    }

    deleteErrorCode(code: number): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes =
            this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.filter(c => c !== code);
        this.updateFormErrors();
    }

    addErrorMessage(): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages.push('');
        this.updateFormErrors();
    }

    deleteErrorMessage(message: string): void {
        this.exchangeAdapter.networkConfig.nonFatalErrorMessages =
            this.exchangeAdapter.networkConfig.nonFatalErrorMessages.filter(m => m !== message);
        this.updateFormErrors();
    }

    addOptionalConfigItem(): void {
        this.exchangeAdapter.optionalConfig.configItems.push(new ConfigItem('', ''));
        this.updateFormErrors();
    }

    deleteOptionalConfigItem(configItem: ConfigItem): void {
        this.exchangeAdapter.optionalConfig.configItems =
            this.exchangeAdapter.optionalConfig.configItems.filter(c => c !== configItem);
        this.updateFormErrors();
    }

    updateFormErrors(): void {
        this.formErrors['adapterName'] = '';
        this.formErrors['className'] = '';
        this.formErrors['connectionTimeout'] = '';

        for (let i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorHttpStatusCodes.length; i++) {
            this.formErrors['errorCode_' + i] = '';
        }
        for (let i = 0; i < this.exchangeAdapter.networkConfig.nonFatalErrorMessages.length; i++) {
            this.formErrors['errorMessage_' + i] = '';
        }

        for (let i = 0; i < this.exchangeAdapter.optionalConfig.configItems.length; i++) {
            this.formErrors['configItemName_' + i] = '';
            this.formErrors['configItemValue_' + i] = '';
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

        if (this.currentForm === this.exchangeAdapterForm) {
            return;
        }

        this.exchangeAdapterForm = this.currentForm;
        if (this.exchangeAdapterForm) {
            this.exchangeAdapterForm.valueChanges
                .subscribe(data => this.onValueChanged(data));
        }
    }

    onValueChanged(data?: any) {

        if (!this.exchangeAdapterForm) {
            return;
        }

        const form = this.exchangeAdapterForm.form;

        for (const field in this.formErrors) {
            if (this.formErrors.hasOwnProperty(field)) {
                // clear previous error message (if any)
                this.formErrors[field] = '';
                const control = form.get(field);

                // 1st condition validates existing strat; 2nd condition validates new strat.
                if ((control && control.dirty && !control.valid) ||
                    (control && control.pristine && !control.valid && this.exchangeAdapterForm.submitted)) {

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
