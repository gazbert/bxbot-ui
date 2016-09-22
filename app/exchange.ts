export class Exchange {

    id: string;
    adapter: string;
    networkConfig: {
        connectionTimeout: number,
        nonFatalErrorHttpStatusCodes: number[]
        nonFatalErrorMessages: string[]
    }
}
