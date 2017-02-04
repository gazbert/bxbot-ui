import {MockBackend, MockConnection} from "@angular/http/testing";
import {HttpModule, Http, XHRBackend, Response, ResponseOptions} from "@angular/http";
import {async, inject, TestBed} from "@angular/core/testing";
import {Exchange} from "./exchange.model";
import {ExchangeHttpDataPromiseService as ExchangeDataService} from "./exchange-http-data-promise.service";

/**
 * Tests the Exchange HTTP Service (Promise flavour) using a mocked HTTP backend.
 * TODO tests for getExchange() and update()
 *
 * @author gazbert
 */
describe('ExchangeHttpDataPromiseService tests using TestBed and Mock HTTP backend', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                ExchangeDataService,
                {provide: XHRBackend, useClass: MockBackend}
            ]
        })
            .compileComponents();
    }));

    it('should instantiate service when inject service',
        inject([ExchangeDataService], (service: ExchangeDataService) => {
            expect(service instanceof ExchangeDataService).toBe(true);
        }));

    it('should instantiate service with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new ExchangeDataService(http);
        expect(service instanceof ExchangeDataService).toBe(true, 'new service should be ok');
    }));

    // TODO What's this all about? Are we just testing Angular here?
    it('should provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    describe('when getExchanges', () => {

        let backend: MockBackend;
        let service: ExchangeDataService;
        let fakeExchanges: Exchange[];
        let response: Response;

        beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
            backend = be;
            service = new ExchangeDataService(http);
            fakeExchanges = makeExchangeData();
            let options = new ResponseOptions({status: 200, body: {data: fakeExchanges}});
            response = new Response(options);
        }));

        it('should have expected fake Exchanges ', async(inject([], () => {
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            service.getExchanges()
                .then(exchanges => {
                    expect(exchanges.length).toBe(fakeExchanges.length,
                        'should have expected 3 Exchanges');
                });
        })));

        it('should be OK returning no Exchanges', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 200, body: {data: []}}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
            service.getExchanges()
                .then(exchanges => {
                    expect(exchanges.length).toBe(0, 'should have no Exchanges');
                });
        })));

        // TODO FIXME
        xit('should treat 404 as an error', async(inject([], () => {
            let resp = new Response(new ResponseOptions({status: 404}));
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));

            service.getExchanges()
                .then(() => {
                    fail('should not respond with Exchanges');
                })
                .catch(err => {
                    expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
                });
        })));
    });
});

const makeExchangeData = () => [
    new Exchange('bitstamp', 'Bitstamp', 'Running'),
    new Exchange('gdax', 'GDAX', 'Stopped'),
    new Exchange('gemini', 'Gemini', 'Running'),
] as Exchange[];

