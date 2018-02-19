/**
 * Encapsulates a Bot's config.
 *
 * @author gazbert
 */
export class BotConfig {

    constructor(public id: string,
                public name: string,
                public baseUrl: string,
                public username: string,
                public password: string) {
    }

    clone() {
        return new BotConfig(this.id, this.name, this.baseUrl, this.username, this.password);
    }
}
