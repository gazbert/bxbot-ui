export class Exchange {
    constructor(public id: string,
                public adapter: string,
                public networkConfig: NetworkConfig) {
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
