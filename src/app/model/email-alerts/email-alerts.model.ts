/**
 * Encapsulates Email Alerts config for a bot.
 *
 * @author gazbert
 */
export class EmailAlertsConfig {

    constructor(public id: string,
                public enabled: boolean,
                public smtpConfig: SmtpConfig) {
    }

    clone() {
        return new EmailAlertsConfig(this.id, this.enabled, this.smtpConfig);
    }
}

export class SmtpConfig {
    constructor(public smtpHost: string,
                public smtpPort: number,
                public accountUsername: string,
                public accountPassword: string,
                public toAddress: string,
                public fromAddress: string) {
    }
}
