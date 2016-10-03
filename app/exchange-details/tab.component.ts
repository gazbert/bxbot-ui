import {Component, Input} from "@angular/core";

/**
 * TODO Move to shared folder
 *
 * Based on the excellent:
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
export class Tab {
    @Input('tabTitle') title: string;
    @Input() active = false;
}