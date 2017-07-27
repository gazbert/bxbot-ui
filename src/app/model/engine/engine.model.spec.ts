/**
 * Tests the Engine model behaves as expected.
 *
 * @author gazbert
 */
import {Engine} from './engine.model';

describe('Engine model tests', () => {

    it('should have correct initial values', () => {
        const engine = new Engine('gdax', 'GDAX', 30, 'BTC', 0.54);

        expect(engine.id).toBe('gdax');
        expect(engine.botName).toBe('GDAX');
        expect(engine.tradingCycleInterval).toBe(30);
        expect(engine.emergencyStopCurrency).toBe('BTC');
        expect(engine.emergencyStopBalance).toBe(0.54);
    });

    it('should clone itself', () => {
        const exchangeAdapter = new Engine('btce', 'BTC-e', 15, 'BTC', 1.20);
        const clone = exchangeAdapter.clone();
        expect(exchangeAdapter).toEqual(clone);
    });
});
