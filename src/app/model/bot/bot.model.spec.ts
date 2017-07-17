import {Bot} from "./bot.model";

/**
 * Tests the Bot model behaves as expected.
 *
 * @author gazbert
 */
describe('Bot model tests', () => {

    it('should have correct initial values', () => {
        const bot = new Bot('gdax', 'GDAX', 'Running');
        expect(bot.id).toBe('gdax');
        expect(bot.name).toBe('GDAX');
        expect(bot.status).toBe('Running');
    });

    it('should clone itself', () => {
        const bot = new Bot('btce', 'BTC-e', 'Stopped');
        const clone = bot.clone();
        expect(bot).toEqual(clone);
    });
});