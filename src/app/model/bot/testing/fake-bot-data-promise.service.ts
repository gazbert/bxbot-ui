import {BotHttpDataPromiseService} from "../bot-http-data-promise.service";
import {Bot} from "../bot.model";

/**
 * Fake Bot data service (Promise flavour) backend for testing.
 *
 * Constructor is inherited from BotHttpDataPromiseService - calling code should pass null when creating this object.
 * This seems very hacky.
 * Must be better way of doing this, but we have to inject concrete service classes into the components...
 *
 * @author gazbert
 */
export class FakeBotDataPromiseService extends BotHttpDataPromiseService {

    bots = SOME_FAKE_PROMISE_BOTS.map(e => e.clone());
    lastPromise: Promise<any>;  // remember so we can spy on promise calls

    getBots() {
        return this.lastPromise = Promise.resolve<Bot[]>(this.bots);
    }

    getBot(id: number) {
        let bot = this.bots.find(e => e.id === id);
        return this.lastPromise = Promise.resolve(bot);
    }

    update(bot: Bot): Promise<Bot> {
        return this.lastPromise = this.getBot(bot.id).then(e => {
            return e ?
                Object.assign(e, bot) :
                Promise.reject(`Bot ${bot.id} not found`) as any as Promise<Bot>;
        });
    }
}

export var SOME_FAKE_PROMISE_BOTS: Bot[] = [
    new Bot(1, 'Bitstamp', 'Running'),
    new Bot(2, 'GDAX', 'Running'),
    new Bot(3, 'Gemini', 'Stopped')
];