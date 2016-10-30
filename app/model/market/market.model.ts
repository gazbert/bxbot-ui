import {TradingStrategy} from "../trading-strategy/trading-strategy.model";

/**
 * Encapsulates a Market.
 *
 * @author gazbert
 */
export class Market {

    constructor(public id: string,
                public label: string,
                public exchangeId: string,
                public enabled: boolean,
                public baseCurrency: string,
                public counterCurrency: string,
                public tradingStrategy: TradingStrategy) {
    }
}