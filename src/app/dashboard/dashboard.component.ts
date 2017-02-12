import {Router} from "@angular/router";
import {Component, OnInit} from "@angular/core";
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {Exchange, ExchangeHttpDataObservableService} from "../model/exchange";

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
 * The Dashboard displays the Exchanges the bots are running on.
 *
 * It provides the landing screen and Command & Control centre for the app.
 *
 * The component also demonstrates use of RxJS Observables to display the Exchanges:
 * http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
 *
 * @author gazbert
 */
@Component({
    moduleId: module.id,
    selector: 'bx-dashboard',
    templateUrl: 'dashboard.component.html',
    styleUrls: ['dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    /**
     * An Observable is a stream of events that can be processed with array-like operators.
     * Here we declare our stream of Exchange events.
     */
    exchanges: Observable<Exchange[]>;

    /**
     * A Subject is a producer of an Observable event stream.
     * 'searchTerms' produces an Observable of strings, the filter criteria for the name search.
     * Each call to search puts a new string into this Subject's Observable stream by calling next.
     */
    private searchTerms = new Subject<string>();
    private errorMessage: string;

    constructor(private router: Router, private exchangeDataService: ExchangeHttpDataObservableService) {
    }

    /**
     * Our ngOnInit sets up the Observable of Exchanges.
     *
     * It turns the stream of search terms into a stream of Exchange arrays and assigns the result to the
     * exchanges property.
     *
     * Based off Observable example in the main Angular tutorial:
     * https://angular.io/docs/ts/latest/tutorial/toh-pt6.html#
     *
     * We don't pass every user keystroke directly to the ExchangeHttpDataService, else we'd send a load of HTTP
     * requests! We achieve this by chaining Observable operators: debounceTime(300) and distinctUntilChanged.
     *
     * The switchMap calls ExchangeHttpDataService for each search term that makes it through the debounce and
     * distinctUntilChanged checks. It cancels and discards previous search Observables, returning only the
     * latest ExchangeHttpDataService Observable.
     *
     * Every qualifying key event can trigger an HTTP method call. Even with a 300ms pause between requests,
     * we could have multiple HTTP requests in flight, and they may not return in the order sent.
     * switchMap preserves the original request order while returning only the Observable from the most recent HTTP
     * method call. Results from prior calls are canceled and discarded.
     *
     * If the search text is empty, we short-circuit the HTTP method call, and return an Observable containing the
     * first 8 Exchanges.
     *
     * NOTE: canceling the ExchangeHttpDataService observable won't actually abort a pending HTTP request. Angular does
     * not support this yet - it just discards unwanted results.
     */
    ngOnInit(): void {
        this.exchanges = this.searchTerms
            .debounceTime(300)        // wait 300ms after each keystroke before considering the term
            .distinctUntilChanged()   // ignore if next search term is same as previous
            .switchMap(term => term   // switch to new Observable each time the term changes
                // return the http search Observable
                ? this.exchangeDataService.getExchangeByName(term)
                // or the first 8 Exchanges if there was no search term entered by user
                : this.exchangeDataService.getExchanges().toPromise().then((exchanges) => exchanges.slice(0, 8)))
            .catch(error => {
                // TODO - Show meaningful error to user?
                this.errorMessage = error;
                console.log(error);
                return Observable.of<Exchange[]>([]);
            });
    }

    ngAfterViewInit() {
        // trigger initial display of Exchanges.
        this.searchTerms.next('');
    }

    search(term: string) {
        this.searchTerms.next(term);
    }

    gotoExchangeDetails(exchange: Exchange): void {
        // TODO - when to use navigate vs navigateByUrl ?
        // let link = ['/exchange', exchange.id];
        // this.router.navigate(link);

        let url = `/exchange/${exchange.id}`;
        this.router.navigateByUrl(url);
    }
}
