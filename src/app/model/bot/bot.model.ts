/**
 * Encapsulates a Bot.
 *
 * @author gazbert
 */
export class Bot {

    constructor(public id: string,
                public name: string,
                public status: string) {
    }

    clone() {
        return new Bot(this.id, this.name, this.status);
    }
}