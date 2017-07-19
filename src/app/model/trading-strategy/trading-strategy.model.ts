/**
 * Encapsulates a Trading Strategy.
 *
 * @author gazbert
 */
export class TradingStrategy {

    constructor(public id: string,
                public botId: number,
                public name: string,
                public description: string,
                public className: string) {
    }

    clone() {
        return new TradingStrategy(this.id, this.botId, this.name, this.description, this.className);
    }
}