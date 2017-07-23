import {Component, Input} from '@angular/core';

/**
 * Represents a single screen tab.
 *
 * Originated from the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/
 */
@Component({
    selector: 'app-bxbot-ui-tab',
    styles: [`
    .pane{
      padding: 1em;
    }
  `],
    template: `
    <div [hidden]="!active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
    @Input('title') title: string;
    @Input('id') id: string;
    @Input() active = false;
}
