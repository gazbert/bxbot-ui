/**
 * Encapsulates a Bot.
 *
 * @author gazbert
 */
export class Bot {

    constructor(public id: number,
                public name: string,
                public status: string) {
    }

    clone() {
        return new Bot(this.id, this.name, this.status);
    }
}