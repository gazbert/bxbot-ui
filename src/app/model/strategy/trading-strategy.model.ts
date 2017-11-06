/**
 * Encapsulates a Strategy.
 *
 * @author gazbert
 */
export class Strategy {

    constructor(public id: string,
                public botId: string,
                public name: string,
                public description: string,
                public className: string,
                public optionalConfig: OptionalConfig) {
    }

    clone() {
        return new Strategy(this.id, this.botId, this.name, this.description, this.className, this.optionalConfig);
    }
}

export class OptionalConfig {
    constructor(public configItems: ConfigItem[]) {
    }
}

export class ConfigItem {
    constructor(public name: string,
                public value: string) {
    }
}
