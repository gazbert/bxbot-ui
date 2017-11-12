import {BotStatus} from './bot-status.model';

/**
 * Tests the BotStatus model behaves as expected.
 *
 * @author gazbert
 */
describe('BotStatus model tests', () => {

    it('should have correct initial values', () => {
        const bot = new BotStatus('gdax-1', 'GDAX', 'Running');
        expect(bot.id).toBe('gdax-1');
        expect(bot.name).toBe('GDAX');
        expect(bot.status).toBe('Running');
    });

    it('should clone itself', () => {
        const bot = new BotStatus('huobi-1', 'Huobi', 'Stopped');
        const clone = bot.clone();
        expect(bot).toEqual(clone);
    });
});
