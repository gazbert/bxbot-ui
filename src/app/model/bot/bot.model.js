"use strict";
/**
 * Encapsulates a Bot.
 *
 * @author gazbert
 */
var Bot = (function () {
    function Bot(id, name, status) {
        this.id = id;
        this.name = name;
        this.status = status;
    }
    Bot.prototype.clone = function () {
        return new Bot(this.id, this.name, this.status);
    };
    return Bot;
}());
exports.Bot = Bot;
//# sourceMappingURL=bot.model.js.map