"use strict";
/**
 * Encapsulates a Trading Strategy.
 *
 * @author gazbert
 */
var TradingStrategy = (function () {
    function TradingStrategy(id, botId, name, description, className) {
        this.id = id;
        this.botId = botId;
        this.name = name;
        this.description = description;
        this.className = className;
    }
    TradingStrategy.prototype.clone = function () {
        return new TradingStrategy(this.id, this.botId, this.name, this.description, this.className);
    };
    return TradingStrategy;
}());
exports.TradingStrategy = TradingStrategy;
//# sourceMappingURL=trading-strategy.model.js.map