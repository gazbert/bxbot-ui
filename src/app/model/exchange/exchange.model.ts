/**
 * Encapsulates an Exchange.
 *
 * @author gazbert
 */
export class Exchange {

    constructor(public id: string,
                public name: string,
                public status: string) {
    }

    clone() {
        return new Exchange(this.id, this.name, this.status);
    }
}