"use strict";
var testing_1 = require("@angular/core/testing");
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_component_1 = require("./app.component");
var appComponentUnderTest;
var fixture;
var de;
var el;
describe('Main Application Component tests', function () {
    beforeEach(testing_1.async(function () {
        testing_1.TestBed.configureTestingModule({
            declarations: [
                app_component_1.AppComponent
            ],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        })
            .compileComponents()
            .then(function () {
            fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
            appComponentUnderTest = fixture.componentInstance;
        });
    }));
    it('should display original BX-bot UI title', function () {
        // query for the title <h1> by CSS element selector
        de = fixture.debugElement.query(platform_browser_1.By.css('h1'));
        el = de.nativeElement;
        fixture.detectChanges();
        expect(el.textContent).toContain(app_component_1.AppComponent.TITLE);
    });
    it('should display a different app title', function () {
        de = fixture.debugElement.query(platform_browser_1.By.css('h1'));
        el = de.nativeElement;
        app_component_1.AppComponent.TITLE = 'Nostromo Title';
        fixture.detectChanges();
        expect(el.textContent).toContain('Nostromo Title');
    });
});
//# sourceMappingURL=app.component.spec.js.map