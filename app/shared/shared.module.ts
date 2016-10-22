import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {TitleCasePipe} from "./title-case.pipe";

/**
 * Simple shared module (for now) to demo integrating with shared components with rest of app.
 *
 * TODO - a lot more stuff will be put in here eventually...
 */
@NgModule({
    imports: [CommonModule],
    exports: [CommonModule, FormsModule, TitleCasePipe],
    declarations: [TitleCasePipe]
})
export class SharedModule {
}

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */