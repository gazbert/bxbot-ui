import {Component} from '@angular/core'

/**
 *
 */
@Component({
    selector: 'bx-exchange-details-tabs',
    template: `
    <tabs>
      <tab [tabTitle]="'Exchange Adapter'"><bx-exchange-adapter-rx></bx-exchange-adapter-rx></tab>
      <!--<tab [tabTitle]="'Exchange Adapter'"><bx-exchange-adapter></bx-exchange-adapter></tab>-->
      
      <tab [tabTitle]="'Markets'">TODO: include Markets content</tab>   
      <tab [tabTitle]="'Strategies'">TODO: include Strategies content</tab>
    </tabs>
  `
})
export class ExchangeDetailsTabsComponent {
}