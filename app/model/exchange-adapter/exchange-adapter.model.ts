/**
 * Encapsulates an Exchange Adapter.
 *
 * @author gazbert
 */
export class ExchangeAdapter {
    constructor(public id: string,
                public exchangeId: string, // TODO why is this here? Redundant/duplicate value of id field?
                public adapter: string,
                public networkConfig: NetworkConfig) {
    }

    clone() {
        return new ExchangeAdapter(this.id, this.exchangeId, this.adapter, this.networkConfig);
    }
}

export class NetworkConfig {
    constructor(public connectionTimeout: number,
                public nonFatalErrorHttpStatusCodes: ErrorCode[],
                public nonFatalErrorMessages: ErrorMessage[]) {
    }
}

export class ErrorCode {
    constructor(public value: number) {
    }
}

export class ErrorMessage {
    constructor(public value: string) {
    }
}