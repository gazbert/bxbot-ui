///<reference path="router-stubs.ts"/>
import {NgModule} from '@angular/core';
import {RouterLinkStubDirective, RouterOutletStubComponent} from './router-stubs';

/**
 * Shared module to hold testing utils stuff.
 *
 * @author gazbert
 */
@NgModule({
    imports: [TestingUtilsModule],
    exports: [RouterOutletStubComponent, RouterLinkStubDirective],
    declarations: [RouterOutletStubComponent, RouterLinkStubDirective]
})
export class TestingUtilsModule {
}

