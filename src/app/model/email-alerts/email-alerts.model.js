"use strict";
/**
 * Encapsulates Email Alerts config for a bot.
 *
 * @author gazbert
 */
var EmailAlertsConfig = (function () {
    function EmailAlertsConfig(id, enabled, smtpHost, smtpPort, accountUsername, accountPassword, toAddress, fromAddress) {
        this.id = id;
        this.enabled = enabled;
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
        this.accountUsername = accountUsername;
        this.accountPassword = accountPassword;
        this.toAddress = toAddress;
        this.fromAddress = fromAddress;
    }
    EmailAlertsConfig.prototype.clone = function () {
        return new EmailAlertsConfig(this.id, this.enabled, this.smtpHost, this.smtpPort, this.accountUsername, this.accountPassword, this.toAddress, this.fromAddress);
    };
    return EmailAlertsConfig;
}());
exports.EmailAlertsConfig = EmailAlertsConfig;
//# sourceMappingURL=email-alerts.model.js.map