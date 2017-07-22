"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var router_1 = require("@angular/router");
var core_1 = require("@angular/core");
var Observable_1 = require("rxjs/Observable");
var Subject_1 = require("rxjs/Subject");
var bot_1 = require("../model/bot");
// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
require("rxjs/add/operator/switchMap");
require("rxjs/add/observable/of");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/debounceTime");
require("rxjs/add/operator/distinctUntilChanged");
require("rxjs/add/operator/startWith");
/**
 * The Dashboard displays the Bots.
 *
 * It provides the landing screen and Command & Control centre for the app.
 *
 * The component also demonstrates use of RxJS Observables to display the Bots:
 * http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
 *
 * @author gazbert
 */
var DashboardComponent = (function () {
    function DashboardComponent(router, botDataService) {
        this.router = router;
        this.botDataService = botDataService;
        /**
         * A Subject is a producer of an Observable event stream.
         * 'searchTerms' produces an Observable of strings, the filter criteria for the name search.
         * Each call to search puts a new string into this Subject's Observable stream by calling next.
         */
        this.searchTerms = new Subject_1.Subject();
    }
    /**
     * Our ngOnInit sets up the Observable Bots.
     *
     * It turns the stream of search terms into a stream of Bot arrays and assigns the result to the
     * bots property.
     *
     * Based off Observable example in the main Angular tutorial:
     * https://angular.io/docs/ts/latest/tutorial/toh-pt6.html#
     *
     * We don't pass every user keystroke directly to the BotHttpDataService, else we'd send a load of HTTP
     * requests! We achieve this by chaining Observable operators: debounceTime(200) and distinctUntilChanged.
     *
     * The switchMap calls the BotHttpDataService for each search term that makes it through the debounce and
     * distinctUntilChanged checks. It cancels and discards previous search Observables, returning only the
     * latest BotHttpDataService Observable.
     *
     * Every qualifying key event can trigger an HTTP method call. Even with a 200ms pause between requests,
     * there could be multiple HTTP requests in flight, and they may not return in the order sent.
     * switchMap preserves the original request order and only returns the Observable from the most recent HTTP
     * method call. Results from prior calls are canceled and discarded.
     *
     * If the search text is empty, we short-circuit the HTTP method call, and return an Observable containing the
     * first 8 Bots.
     *
     * NOTE: canceling the BotHttpDataService observable won't actually abort a pending HTTP request. Angular does
     * not support this yet - it just discards unwanted results.
     */
    DashboardComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.bots = this.searchTerms
            .debounceTime(200) // wait 200ms after each keystroke before considering the term
            .distinctUntilChanged() // ignore if next search term is same as previous
            .switchMap(function (term) { return term // switch to new Observable each time the term changes
            ? _this.botDataService.getBotByName(term)
            : _this.botDataService.getBots().toPromise().then(function (bots) { return bots.slice(0, 8); }); })
            .catch(function (error) {
            // TODO - Show meaningful error to user? Redirect to friendly error page?
            _this.errorMessage = error;
            console.log("TODO - Barf! : " + error);
            _this.router.navigateByUrl("/login").then();
            return Observable_1.Observable.of([]);
        });
    };
    DashboardComponent.prototype.ngAfterViewInit = function () {
        // trigger initial display of Bots.
        this.searchTerms.next('');
    };
    DashboardComponent.prototype.search = function (term) {
        this.searchTerms.next(term);
    };
    DashboardComponent.prototype.gotoBotDetails = function (bot) {
        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/bot', bot.id];
        // this.router.navigate(link);
        var url = "/bot/" + bot.id;
        this.router.navigateByUrl(url);
    };
    return DashboardComponent;
}());
DashboardComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'bx-dashboard',
        templateUrl: 'dashboard.component.html',
        styleUrls: ['dashboard.component.css']
    }),
    __metadata("design:paramtypes", [router_1.Router, bot_1.BotHttpDataObservableService])
], DashboardComponent);
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map