export class Exchange {
    id: string;
    adapter: string;
    networkConfig: NetworkConfig;
}

export class NetworkConfig{
    connectionTimeout: number;
    nonFatalErrorHttpStatusCodes: Array<ErrorCode>;
    nonFatalErrorMessages: Array<ErrorMessage>;
}

export class ErrorCode {
    value: number;

    constructor(value: number) {
        this.value = value;
    }
}

export class ErrorMessage {
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}
