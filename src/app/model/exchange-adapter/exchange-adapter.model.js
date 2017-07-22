"use strict";
/**
 * Encapsulates an Exchange Adapter.
 *
 * For now, decision taken not to expose AuthenticationConfig (API key + secret) through REST API - changes have to be
 * made on the local bot node. Might revisit this in the future.
 *
 * @author gazbert
 */
var ExchangeAdapter = (function () {
    function ExchangeAdapter(id, name, className, botId, networkConfig) {
        this.id = id;
        this.name = name;
        this.className = className;
        this.botId = botId;
        this.networkConfig = networkConfig;
    }
    ExchangeAdapter.prototype.clone = function () {
        return new ExchangeAdapter(this.id, this.name, this.className, this.botId, this.networkConfig);
    };
    return ExchangeAdapter;
}());
exports.ExchangeAdapter = ExchangeAdapter;
var NetworkConfig = (function () {
    function NetworkConfig(connectionTimeout, nonFatalErrorHttpStatusCodes, nonFatalErrorMessages) {
        this.connectionTimeout = connectionTimeout;
        this.nonFatalErrorHttpStatusCodes = nonFatalErrorHttpStatusCodes;
        this.nonFatalErrorMessages = nonFatalErrorMessages;
    }
    return NetworkConfig;
}());
exports.NetworkConfig = NetworkConfig;
//# sourceMappingURL=exchange-adapter.model.js.map