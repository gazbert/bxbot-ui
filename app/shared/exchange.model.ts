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

    // the Angular constructor shortcut creates and initialises the value property var
    constructor(public value: number) {
    }
}

export class ErrorMessage {

    // the traditional way of doing things
    value: string;
    constructor(value: string) {
        this.value = value;
    }
}
