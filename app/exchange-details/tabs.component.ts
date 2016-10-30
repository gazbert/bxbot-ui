import {Component, ContentChildren, QueryList, AfterContentInit} from "@angular/core";
import {TabComponent} from "./tab.component";

/**
 * TODO Move to shared folder and make re-usable
 *
 * Based on the excellent:
 * http://juristr.com/blog/2016/02/learning-ng2-creating-tab-component/
 */
@Component({
    selector: 'tabs',
    template: `
    <ul class="nav nav-pills">
      <li *ngFor="let tab of tabs; trackBy:trackByTabTitle" (click)="selectTab(tab)" [class.active]="tab.active">            
        <a href="exchange/{{tab.exchangeId}}#"><span>{{tab.title | titlecase}}</span></a>
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
        let activeTabs = this.tabs.filter((tab)=>tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0) {
            this.selectTab(this.tabs.first);
        }
    }

    selectTab(tab: TabComponent) {
        // deactivate all tabs
        this.tabs.toArray().forEach(tab => tab.active = false);

        // activate the tab the user has clicked on.
        tab.active = true;
    }

    trackByTabTitle(index: number, title: string) { return title; }
}