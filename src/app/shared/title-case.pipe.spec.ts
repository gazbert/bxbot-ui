import {TitleCasePipe} from './title-case.pipe';

/**
 * Tests behaviour of the Title case pipe component.
 *
 * TitleCasePipe taken from Angular tutorial material:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
describe('Shared TitleCasePipe component tests', () => {

    // This pipe is a pure, stateless function so no need for BeforeEach
    const pipe = new TitleCasePipe();

    it('transforms "abc" to "Abc"', () => {
        expect(pipe.transform('abc')).toBe('Abc');
    });

    it('transforms "abc def" to "Abc Def"', () => {
        expect(pipe.transform('abc def')).toBe('Abc Def');
    });

    // ... more tests ...
    it('leaves "Abc Def" unchanged', () => {
        expect(pipe.transform('Abc Def')).toBe('Abc Def');
    });

    it('transforms "abc-def" to "Abc-def"', () => {
        expect(pipe.transform('abc-def')).toBe('Abc-def');
    });

    it('transforms "   abc   def" to "   Abc   Def" (preserves spaces) ', () => {
        expect(pipe.transform('   abc   def')).toBe('   Abc   Def');
    });
});

/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */
