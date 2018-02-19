import {BotConfig} from './bot-config.model';

/**
 * Tests the BotConfig model behaves as expected.
 *
 * @author gazbert
 */
describe('BotStatus model tests', () => {

    it('should have correct initial values', () => {
        const bot = new BotConfig('gdax-1', 'GDAX Bot', 'https://jakku.com/api/v1', 'rey', 'force');
        expect(bot.id).toBe('gdax-1');
        expect(bot.name).toBe('GDAX Bot');
        expect(bot.baseUrl).toBe('https://jakku.com/api/v1');
        expect(bot.username).toBe('rey');
        expect(bot.password).toBe('force');
    });

    it('should clone itself', () => {
        const bot = new BotConfig('gdax-1', 'GDAX Bot', 'https://jakku.com/api/v1', 'rey', 'force');
        const clone = bot.clone();
        expect(bot).toEqual(clone);
    });
});
