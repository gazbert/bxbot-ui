/**
 * Encapsulates a Bot's status.
 *
 * @author gazbert
 */
export class BotStatus {

    constructor(public id: string,
                public displayName: string,
                public status: string) {
    }

    clone() {
        return new BotStatus(this.id, this.displayName, this.status);
    }
}
