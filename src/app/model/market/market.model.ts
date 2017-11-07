import {Strategy} from '../strategy/strategy.model';

/**
 * Encapsulates a Market.
 *
 * @author gazbert
 */
export class Market {

    constructor(public id: string,
                public botId: string,
                public name: string,
                public enabled: boolean,
                public baseCurrency: string,
                public counterCurrency: string,
                public strategy: Strategy) {
    }

    clone() {
        return new Market(this.id, this.botId, this.name, this.enabled, this.baseCurrency, this.counterCurrency,
            this.strategy);
    }
}
