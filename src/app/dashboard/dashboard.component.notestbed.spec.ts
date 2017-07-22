import {Router} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {FakeBotDataObservableService} from '../model/bot/testing';
import {Bot} from '../model/bot';

/**
 * Tests the behaviour of the Dashboard component is as expected.
 *
 * It uses Fake/Dummy/Stubbed collaborators instead of Jasmine Spies for the
 * tests. I think I prefer the spy method - less boiler plate stub code to write.
 *
 * Based off the the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * @author gazbert
 */
describe('DashboardComponent tests without TestBed', () => {

    let comp: DashboardComponent;
    let botDataService: FakeBotDataObservableService;
    let router: Router;

    beforeEach(() => {
        addMatchers();
        router = new FakeRouter() as any as Router;
        botDataService = new FakeBotDataObservableService(null);
        comp = new DashboardComponent(router, botDataService);
    });

    it('should NOT have Bot items before calling ngOnInit', () => {
        expect(comp.bots).not.toBeDefined('should not have Bots items before ngOnInit called');
    });

    it('should have 3 Bot items after ngAfterViewInit', (done) => {
        comp.ngOnInit();
        comp.bots.subscribe((bots) => {
            expect(bots.length).toBe(3, 'should have 3 Bot items after ngAfterViewInit');

            // paranoia!
            expect(bots[0].id).toBe(1);
            expect(bots[1].id).toBe(2);
            expect(bots[2].id).toBe(3);

            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        comp.ngAfterViewInit();
    });

    // FIXME - search not working ;-/
    xit('should have Gemini Bot item after user searches for \'ge\'', (done) => {
        comp.ngOnInit();
        comp.bots.subscribe((bots) => {
            expect(bots.length).toBe(1, 'should have 1 Gemini Bot item');
            expect(bots[0].id).toBe(2);

            done(); // https://github.com/jasmine/jasmine/issues/694
        });
        // comp.ngAfterViewInit();
        comp.search('ge');
    });

    it('should tell Router to navigate by BotId when Bot item selected', () => {
        const testBot = new Bot(1, 'GDAX', 'Running');
        const spy = spyOn(router, 'navigateByUrl');
        comp.gotoBotDetails(testBot);
        const navArgs = spy.calls.mostRecent().args[0];
        expect(navArgs).toBe('/bot/1', 'should navigate to GDAX Bot Details for selected Bot');
    });
});

class FakeRouter {

    navigateByUrl(url: string) {
        return url;
    }

    navigate(url: string) {
        return url;
    }
}

/**
 * Testing utils below taken from Angular tutorial material:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 */
export function addMatchers(): void {
  jasmine.addMatchers({
    toHaveText: toHaveText
  });
}
function toHaveText(): jasmine.CustomMatcher {
  return {
    compare: function (actual: any, expectedText: string, expectationFailOutput?: any): jasmine.CustomMatcherResult {
      const actualText = elementText(actual);
      const pass = actualText.indexOf(expectedText) > -1;
      const message = pass ? '' : composeMessage();
      return {pass, message};

      function composeMessage() {
        const a = (actualText.length < 100 ? actualText : actualText.substr(0, 100) + '...');
        const efo = expectationFailOutput ? ` '${expectationFailOutput}'` : '';
        return `Expected element to have text content '${expectedText}' instead of '${a}'${efo}`;
      }
    }
  };
}
function elementText(n: any): string {
  if (n instanceof Array) {
    return n.map(elementText).join('');
  }

  if (n.nodeType === Node.COMMENT_NODE) {
    return '';
  }

  if (n.nodeType === Node.ELEMENT_NODE && n.hasChildNodes()) {
    return elementText(Array.prototype.slice.call(n.childNodes));
  }

  if (n.nativeElement) {
    n = n.nativeElement;
  }

  return n.textContent;
}
/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that
 can be found in the LICENSE file at http://angular.io/license
 */

