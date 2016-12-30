import {Exchange} from "./exchange.model";

/**
 * Tests the Exchange model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange', () => {

    it('has correct initial values', () => {
        const exchange = new Exchange('gdax', 'GDAX', 'Running');
        expect(exchange.id).toBe('gdax');
        expect(exchange.name).toBe('GDAX');
        expect(exchange.status).toBe('Running');
    });

    it('can clone itself', () => {
        const exchange = new Exchange('btce', 'BTC-e', 'Stopped');
        const clone = exchange.clone();
        expect(exchange).toEqual(clone);
    });
});