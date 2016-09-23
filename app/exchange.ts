export class Exchange {

    id: string;
    adapter: string;
    networkConfig: NetworkConfig;
}

export class NetworkConfig{
    connectionTimeout: number;
    nonFatalErrorHttpStatusCodes: Array<ErrorCode>;
    errorMessages: Array<ErrorMessage>;
}

export class ErrorCode {
    id: number;
    value: number;
}

class ErrorMessage {
    id: number;
    value: string;
}
