/**
 * Encapsulates a Bot's status.
 *
 * @author gazbert
 */
export class BotStatus {

    constructor(public id: string,
                public name: string,
                public status: string) {
    }

    clone() {
        return new BotStatus(this.id, this.name, this.status);
    }
}
