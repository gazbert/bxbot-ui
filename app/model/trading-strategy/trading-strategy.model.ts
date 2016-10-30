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
}