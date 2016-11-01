/**
 * Encapsulates a Trading Strategy.
 *
 * @author gazbert
 */
export class TradingStrategy {

    constructor(public id: string,
                public label: string,
                public exchangeId: string,
                public description: string,
                public className: string) {
    }

    clone() {
        return new TradingStrategy(this.id, this.label, this.exchangeId, this.description, this.className);
    }
}