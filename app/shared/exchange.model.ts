export class Exchange {
    id: string;
    adapter: string;
    networkConfig: NetworkConfig;
}

export class NetworkConfig{
    connectionTimeout: number;
    nonFatalErrorHttpStatusCodes: ErrorCode[];
    nonFatalErrorMessages: ErrorMessage[];
}

export class ErrorCode {
    constructor(public value: number) {
    }
}

export class ErrorMessage {
    constructor(public value: string) {
    }
}
