/**
 * Encapsulates an Exchange Adapter.
 *
 * @author gazbert
 */
export class ExchangeAdapter {
    constructor(public id: string,
                public name: string,
                public adapter: string,
                public networkConfig: NetworkConfig) {
    }

    clone() {
        return new ExchangeAdapter(this.id, this.name, this.adapter, this.networkConfig);
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