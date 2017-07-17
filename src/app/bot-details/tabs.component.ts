import {Component, ContentChildren, QueryList, AfterContentInit} from '@angular/core';
import {TabComponent} from './tab.component';

/**
 * Presents a list of config tabs. Currently rendered as Bootstrap Pills.
 *
 * Originated from the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/
 */
@Component({
    selector: 'tabs',
    template: `
    <ul class="nav nav-pills">
      <li *ngFor="let tab of tabs; trackBy:trackByTabTitle" (click)="selectTab(tab)" [class.active]="tab.active">            
        <a href="bot/{{tab.id}}#"><span>{{tab.title | titlecase}}</span></a>
      </li>
    </ul>
    <ng-content></ng-content>
  `
})
export class TabsComponent implements AfterContentInit {

    @ContentChildren(TabComponent) tabs: QueryList<TabComponent>;

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((t) => t.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: TabComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach(t => t.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;
    }

    trackByTabTitle(index: number, title: string) {
        return title;
    }
}
