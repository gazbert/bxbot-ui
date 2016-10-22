import {Pipe, PipeTransform} from "@angular/core";

/**
 * Simple shared pipe component to demo integrating with shared components with rest of app.
 *
 * Transforms to uppercase the first letter of the words in a given string.
 *
 * Taken from: https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
@Pipe({name: 'titlecase', pure: false})
export class TitleCasePipe implements PipeTransform {
    transform(input: string): string {
        return input.length === 0 ? '' :
            input.replace(/\w\S*/g, (txt => txt[0].toUpperCase() + txt.substr(1).toLowerCase()));
    }
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */