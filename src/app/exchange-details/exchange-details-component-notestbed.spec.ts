import {ActivatedRouteStub} from '../../testing';
import {Exchange} from '../model/exchange';
import {ExchangeDetailsComponent} from './exchange-details.component';

/**
 * Tests the behaviour of the Exchange Details component is as expected.
 *
 * Based off the main Angular tutorial:
 * https://angular.io/resources/live-examples/testing/ts/app-specs.plnkr.html
 *
 * @author gazbert
 */
describe('ExchangeDetailsComponent tests without TestBed', () => {

    let activatedRoute: ActivatedRouteStub;
    let exchangeDetailsComponent: ExchangeDetailsComponent;
    let expectedExchange_1: Exchange;
    let spyExchangeDataService: any;
    let router: any;

    beforeEach(done => {

        expectedExchange_1 = new Exchange('bitstamp', 'Bitstamp', 'Running');

        activatedRoute = new ActivatedRouteStub();
        activatedRoute.testParams = {id: expectedExchange_1.id};

        router = jasmine.createSpyObj('router', ['navigate']);

        spyExchangeDataService = jasmine.createSpyObj('ExchangeHttpDataPromiseService', ['getExchange']);
        spyExchangeDataService.getExchange.and.returnValue(Promise.resolve(expectedExchange_1));

        exchangeDetailsComponent = new ExchangeDetailsComponent(spyExchangeDataService, <any> activatedRoute, router);
        exchangeDetailsComponent.ngOnInit();

        // OnInit calls ExchangeDetailsComponent.getExchange; wait for it to get the exchange details
        spyExchangeDataService.getExchange.calls.first().returnValue.then(done);
    });

    it('should expose Exchange Details retrieved from ExchangeDataService', () => {
        expect(exchangeDetailsComponent.exchange).toBe(expectedExchange_1);

        // paranoia ;-)
        expect(exchangeDetailsComponent.exchange.id).toBe('bitstamp');
        expect(exchangeDetailsComponent.exchange.name).toBe('Bitstamp');
        expect(exchangeDetailsComponent.exchange.status).toBe('Running');
    });
});

