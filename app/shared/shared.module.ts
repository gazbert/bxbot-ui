import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TitleCasePipe} from './title-case.pipe';
import {DuplicateNameValidatorDirective} from './duplicate-name';

/**
 * Shared module to demo integrating shared components with rest of app.
 *
 * More useful stuff will be put in here eventually...
 *
 */
@NgModule({
    imports: [CommonModule],
    exports: [CommonModule, FormsModule, TitleCasePipe, DuplicateNameValidatorDirective],
    declarations: [TitleCasePipe, DuplicateNameValidatorDirective]
})
export class SharedModule {
}

