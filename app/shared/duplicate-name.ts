import {Directive, Input, OnChanges, SimpleChanges} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator, ValidatorFn, Validators} from '@angular/forms';

/**
 * Shared Directive component that checks for duplicate names.
 *
 * @author gazbert
 */
@Directive({
    selector: '[duplicateName]',
    providers: [{provide: NG_VALIDATORS, useExisting: DuplicateNameValidatorDirective, multi: true}]
})
export class DuplicateNameValidatorDirective implements Validator, OnChanges {

    @Input() duplicateName: string[];
    private valFn = Validators.nullValidator;

    ngOnChanges(changes: SimpleChanges) {
        const change = changes['duplicateName'];
        if (change) {
            // TODO - for some reason this is a ',' de-limited string instead of an array of string :-/
            const strategyNames = change.currentValue;
            let stratNameStringArray = strategyNames.split(',');
            this.valFn = duplicateNameValidator(stratNameStringArray);
        } else {
            this.valFn = Validators.nullValidator;
        }
    }

    validate(control: AbstractControl): {[key: string]: any} {
        return this.valFn(control);
    }
}

export function duplicateNameValidator(strategyNames: string[]): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {

        const inputName = control.value;
        let isDuplicate;

        for (let i = 0; i < strategyNames.length; i++) {
            let strategyName = strategyNames[i];
            if (strategyName === inputName) {
                isDuplicate = true;
                break;
            } else {
                isDuplicate = false;
            }
        }
        return isDuplicate ? {'duplicateName': {name}} : null;
    };
}
