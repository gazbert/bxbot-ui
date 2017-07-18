import "rxjs/add/operator/toPromise";
import {Bot} from "./bot.model";

/**
 * The Bot Data Service provides operations to update Bot configuration.
 * It demonstrates use of Promises in the operation responses.
 *
 * @author gazbert
 */
export interface BotDataPromiseService {

    getBots(): Promise<Bot[]>;
    getBot(id: number): Promise<Bot>;
    update(exchange: Bot): Promise<Bot>;
}
