import {Injectable} from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {environment} from '../../environments/environment';

/**
 *
 * Environment aware service for building REST endpoint URLs.
 *
 * @author gazbert
 */
@Injectable()
export class RestApiUrlService {

    private static REST_API_CONFIG_URL_PATH = '/config/bots/';
    private static REST_API_RUNTIME_URL_PATH = '/runtime/bots/';

    constructor() {
    }

    public static buildGetConfigEndpointUrl(botId: string, endpoint: string): string {
        let configEndpointUri;
        if (environment.production) {
            configEndpointUri = environment.restApiBaseUrl + RestApiUrlService.REST_API_CONFIG_URL_PATH + botId + endpoint;
        } else {
            configEndpointUri = environment.restApiBaseUrl + endpoint + '?botId=' + botId;
        }
        return configEndpointUri;
    }

    public static buildUpdateConfigEndpointUrl(botId: string, endpoint: string): string {
        let configEndpointUri;
        if (environment.production) {
            configEndpointUri = environment.restApiBaseUrl + RestApiUrlService.REST_API_CONFIG_URL_PATH + botId + endpoint;
        } else {
            configEndpointUri = environment.restApiBaseUrl + endpoint;
        }
        return configEndpointUri;
    }

    public static buildRuntimeEndpointUrl(botId: string, endpoint: string): string {
        let configEndpointUri;
        if (environment.production) {
            configEndpointUri = environment.restApiBaseUrl + RestApiUrlService.REST_API_RUNTIME_URL_PATH + botId + endpoint;
        } else {
            configEndpointUri = environment.restApiBaseUrl + endpoint + '?botId=' + botId;
        }
        return configEndpointUri;
    }
}
