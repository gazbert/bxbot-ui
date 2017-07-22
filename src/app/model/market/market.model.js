"use strict";
/**
 * Encapsulates a Market.
 *
 * @author gazbert
 */
var Market = (function () {
    function Market(id, botId, name, enabled, baseCurrency, counterCurrency, tradingStrategy) {
        this.id = id;
        this.botId = botId;
        this.name = name;
        this.enabled = enabled;
        this.baseCurrency = baseCurrency;
        this.counterCurrency = counterCurrency;
        this.tradingStrategy = tradingStrategy;
    }
    Market.prototype.clone = function () {
        return new Market(this.id, this.botId, this.name, this.enabled, this.baseCurrency, this.counterCurrency, this.tradingStrategy);
    };
    return Market;
}());
exports.Market = Market;
//# sourceMappingURL=market.model.js.map