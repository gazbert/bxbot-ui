import {Exchange} from "./exchange.model";

/**
 * Tests the Exchange model behaves as expected.
 *
 * @author gazbert
 */
describe('Exchange model tests', () => {

    it('should have correct initial values', () => {
        const exchange = new Exchange('gdax', 'GDAX', 'Running');
        expect(exchange.id).toBe('gdax');
        expect(exchange.name).toBe('GDAX');
        expect(exchange.status).toBe('Running');
    });

    it('should clone itself', () => {
        const exchange = new Exchange('btce', 'BTC-e', 'Stopped');
        const clone = exchange.clone();
        expect(exchange).toEqual(clone);
    });
});