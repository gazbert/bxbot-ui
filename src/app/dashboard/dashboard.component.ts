import {Router} from '@angular/router';
import {AfterViewInit, Component, OnChanges, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {BotStatus, BotHttpDataObservableService} from '../model/bot';

// Most RxJS operators are not included in Angular's base Observable implementation.
// The base implementation includes only what Angular itself requires.
// If you want more RxJS features, you need to explicitly import rxjs operators, else you get runtime error, e.g.
// 'Failed: this.http.put(...).map is not a function'
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/startWith';

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
@Component({
    selector: 'app-bxbot-ui-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit, OnChanges {

    /**
     * The BotStatus Observable is a stream of BotStatus events that can be processed with array-like operators.
     */
    bots: Observable<BotStatus[]>;

    /**
     * A Subject is a producer of an Observable event stream.
     * 'searchTerms' produces an Observable of strings, the filter criteria for the displayName search.
     * Each call to search puts a new string into this Subject's Observable stream by calling next.
     */
    private searchTerms = new Subject<string>();
    private errorMessage: string;

    constructor(private router: Router, private botDataService: BotHttpDataObservableService) {
    }

    /**
     * Our ngOnInit sets up the Observable Bots.
     *
     * It turns the stream of search terms into a stream of BotStatus arrays and assigns the result to the
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
     * If the search text is empty, we short-circuit the HTTP method call, and return an Observable containing all of the bots.
     *
     * NOTE: canceling the BotHttpDataService observable won't actually abort a pending HTTP request. Angular does
     * not support this yet - it just discards unwanted results.
     */
    ngOnInit(): void {
        this.bots = this.searchTerms
            .debounceTime(200)        // wait 200ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new Observable each time the term changes
                // return the http search Observable
                ? this.botDataService.getBotByName(term)
                // or all of the Bots if there was no search term entered by user
                : this.botDataService.getBots().toPromise())
            .catch(error => {
                // TODO - Show meaningful error to user? Redirect to friendly error page?
                this.errorMessage = error;
                console.log('TODO - Barf! : ' + error);
                this.router.navigateByUrl('/login').then();
                return Observable.of<BotStatus[]>([]);
            });
    }

    ngAfterViewInit() {
        // trigger initial display of Bots.
        this.searchTerms.next('');
    }

    ngOnChanges() {
        // trigger initial display of Bots.
        this.searchTerms.next('');
    }

    search(term: string) {
        this.searchTerms.next(term);
    }

    gotoBotDetails(bot: BotStatus): void {
        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/bot', bot.id];
        // this.router.navigate(link);

        const url = `/bot/${bot.id}`;
        this.router.navigateByUrl(url);
    }
}
