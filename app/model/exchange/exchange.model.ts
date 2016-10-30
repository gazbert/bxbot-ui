/**
 * Encapsulates an Exchange.
 *
 * @author gazbert
 */
export class Exchange {

    constructor(public id: string,
                public label: string,
                public status: string) {
    }

    clone() {
        return new Exchange(this.id, this.label, this.status);
    }
}