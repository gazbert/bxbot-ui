/* tslint:disable:no-unused-variable */
import {AppComponent} from "./app.component";
import {TestBed} from "@angular/core/testing";
import {By} from "@angular/platform-browser";

////////  TODO - Write some SPECS!!  /////////////

describe('AppComponent with TCB', function () {
    beforeEach(() => {
        TestBed.configureTestingModule({declarations: [AppComponent]});
        TestBed.compileComponents();
    });

    it('should instantiate component', () => {
        let fixture = TestBed.createComponent(AppComponent);
        expect(fixture.componentInstance instanceof AppComponent).toBe(true, 'should create AppComponent');
    });

    it('should have expected <h1> text', () => {
        let fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();

        let h1 = fixture.debugElement.query(el => el.name === 'h1').nativeElement;  // it works
        h1 = fixture.debugElement.query(By.css('h1')).nativeElement;                // preferred

        expect(h1.innerText).toMatch(/BX-bot Admin Console/i, '<h1> should say something about "BX-bot Admin Console"');
    });
});
