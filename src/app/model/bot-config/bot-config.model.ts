/**
 * Encapsulates a Bot's config.
 *
 * @author gazbert
 */
export class BotConfig {

    constructor(public id: string,
                public alias: string,
                public baseUrl: string,
                public username: string,
                public password: string) {
    }

    clone() {
        return new BotConfig(this.id, this.alias, this.baseUrl, this.username, this.password);
    }
}
