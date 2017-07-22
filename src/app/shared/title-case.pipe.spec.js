"use strict";
var title_case_pipe_1 = require("./title-case.pipe");
/**
 * Tests behaviour of the Title case pipe component.
 *
 * TitleCasePipe taken from Angular tutorial material:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
describe('Shared TitleCasePipe component tests', function () {
    // This pipe is a pure, stateless function so no need for BeforeEach
    var pipe = new title_case_pipe_1.TitleCasePipe();
    it('transforms "abc" to "Abc"', function () {
        expect(pipe.transform('abc')).toBe('Abc');
    });
    it('transforms "abc def" to "Abc Def"', function () {
        expect(pipe.transform('abc def')).toBe('Abc Def');
    });
    // ... more tests ...
    it('leaves "Abc Def" unchanged', function () {
        expect(pipe.transform('Abc Def')).toBe('Abc Def');
    });
    it('transforms "abc-def" to "Abc-def"', function () {
        expect(pipe.transform('abc-def')).toBe('Abc-def');
    });
    it('transforms "   abc   def" to "   Abc   Def" (preserves spaces) ', function () {
        expect(pipe.transform('   abc   def')).toBe('   Abc   Def');
    });
});
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
//# sourceMappingURL=title-case.pipe.spec.js.map