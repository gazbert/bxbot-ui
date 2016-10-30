/**
 * Encapsulates Email Alerts config for a bot running on an Exchange.
 *
 * @author gazbert
 */
export class EmailAlertsConfig {

    constructor(public id: string,
                public exchangeId: string,
                public enabled: boolean,
                public smtpHost: string,
                public smtpPort: number,
                public accountUsername: string,
                public accountPassword: string,
                public toAddress: string,
                public fromAddress: string) {
    }
}