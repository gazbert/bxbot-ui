import {EngineDataPromiseService} from '../engine-data-promise.service';
import {Engine} from '../engine.model';

/**
 * Fake Engine data service (Promise flavour) backend for testing.
 *
 * @author gazbert
 */
export class FakeEngineDataPromiseService implements EngineDataPromiseService {

    engines = SOME_FAKE_PROMISE_ENGINES.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getEngineByBotId(botId: string) {
        const engine = this.engines.find(e => e.id === botId); // hack for testing!
        return this.lastPromise = Promise.resolve(engine);
    }

    update(botId: string, engine: Engine): Promise<Engine> {
        return this.lastPromise = this.getEngineByBotId(engine.id).then(e => {
            return e ?
                Object.assign(e, engine) :
                Promise.reject(`Engine ${engine.id} not found`) as any as Promise<Engine>;
        });
    }
}

export const SOME_FAKE_PROMISE_ENGINES: Engine[] = [
    new Engine('gdax', 'GDAX', 30, 'BTC', 0.54),
    new Engine('gemini', 'Gemini', 15, 'BTC', 1.54),
    new Engine('bitstamp', 'Bitstamp', 10, 'BTC', 2.54)
];
