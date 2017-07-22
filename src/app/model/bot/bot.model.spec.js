"use strict";
var bot_model_1 = require("./bot.model");
/**
 * Tests the Bot model behaves as expected.
 *
 * @author gazbert
 */
describe('Bot model tests', function () {
    it('should have correct initial values', function () {
        var bot = new bot_model_1.Bot(1, 'GDAX', 'Running');
        expect(bot.id).toBe(1);
        expect(bot.name).toBe('GDAX');
        expect(bot.status).toBe('Running');
    });
    it('should clone itself', function () {
        var bot = new bot_model_1.Bot(2, 'BTC-e', 'Stopped');
        var clone = bot.clone();
        expect(bot).toEqual(clone);
    });
});
//# sourceMappingURL=bot.model.spec.js.map