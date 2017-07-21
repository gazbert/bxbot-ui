/**
 * Encapsulates an Exchange Adapter.
 *
 * For now, decision taken not to expose AuthenticationConfig (API key + secret) through REST API - changes have to be
 * made on the local bot node. Might revisit this in the future.
 *
 * @author gazbert
 */
export class ExchangeAdapter {
    constructor(public id: string,
                public name: string,
                public className: string,
                public botId: number,
                public networkConfig: NetworkConfig) {
    }

    clone() {
        return new ExchangeAdapter(this.id, this.name, this.className, this.botId, this.networkConfig);
    }
}

export class NetworkConfig {
    constructor(public connectionTimeout: number,
                public nonFatalErrorHttpStatusCodes: number[],
                public nonFatalErrorMessages: string[]) {
    }
}