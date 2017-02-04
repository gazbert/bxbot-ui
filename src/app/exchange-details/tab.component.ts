import {Component, Input} from '@angular/core';

/**
 * Presents a single config tab.
 *
 * Originated from the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/
 */
@Component({
    selector: 'tab',
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
    @Input('tabTitle') title: string;
    @Input('exchangeId') exchangeId: string;
    @Input() active = false;
}
