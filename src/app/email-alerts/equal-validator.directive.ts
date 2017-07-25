import {Directive, forwardRef, Attribute} from '@angular/core';
import {Validator, AbstractControl, NG_VALIDATORS} from '@angular/forms';

/**
 * Custom validation directive for validating Email Alerts config.
 *
 * Originated from the excellent:
 * https://scotch.io/tutorials/how-to-implement-a-custom-validator-directive-confirm-password-in-angular-2
 */
@Directive({
    selector: '[appBxBotUiValidateEqual][formControlName],[appBxBotUiValidateEqual][formControl],[appBxBotUiValidateEqual][ngModel]',
    providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => EqualValidatorDirective), multi: true}]
})
export class EqualValidatorDirective implements Validator {

    constructor(@Attribute('appBxBotUiValidateEqual') public validateEqual: string,
                @Attribute('reverse') public reverse: string) {
    }

    private get isReverse() {
        if (!this.reverse) {
            return false;
        }
        return this.reverse === 'true';
    }

    validate(c: AbstractControl): { [key: string]: any } {

        // self value
        const v = c.value;

        // control value
        const e = c.root.get(this.validateEqual);

        // value not equal
        if (e && v !== e.value && !this.isReverse) {
            return {
                validateEqual: false
            };
        }

        // value equal and reverse
        if (e && v === e.value && this.isReverse) {
            delete e.errors['appBxBotUiValidateEqual'];
            if (!Object.keys(e.errors).length) {
                e.setErrors(null);
            }
        }

        // value not equal and reverse
        if (e && v !== e.value && this.isReverse) {
            e.setErrors({
                validateEqual: false
            });
        }
        return null;
    }
}
