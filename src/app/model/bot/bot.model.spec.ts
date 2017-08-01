import {Bot} from './bot.model';

/**
 * Tests the Bot model behaves as expected.
 *
 * @author gazbert
 */
describe('Bot model tests', () => {

    it('should have correct initial values', () => {
        const bot = new Bot('gdax-1', 'GDAX', 'Running');
        expect(bot.id).toBe('gdax-1');
        expect(bot.name).toBe('GDAX');
        expect(bot.status).toBe('Running');
    });

    it('should clone itself', () => {
        const bot = new Bot('huobi-1', 'Huobi', 'Stopped');
        const clone = bot.clone();
        expect(bot).toEqual(clone);
    });
});
