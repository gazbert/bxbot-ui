import {Injectable} from "@angular/core";
import {Headers, Http, Response} from "@angular/http";
import {Observable} from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import {AppComponent} from "../app.component";

/**
 * Authentication service for authenticating with the backend server.
 * It initially logs in with basic auth and stores the returned JWT in local storage for
 * sending in the Authorization header for all subsequent requests.
 * <p>
 * Code originated from the excellent JWT + Angular tutorial by Rich Freeman:
 * http://chariotsolutions.com/blog/post/angular-2-spring-boot-jwt-cors_part2
 */
@Injectable()
export class AuthenticationService {

    private authUrl = AppComponent.AUTH_ENDPOINT_BASE_URL + '/auth';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {
    }

    login(username: string, password: string): Observable<boolean> {
        return this.http.post(this.authUrl, JSON.stringify({
            username: username,
            password: password
        }), {headers: this.headers})
            .map((response: Response) => {
                // login successful if there's a jwt token in the response
                let token = response.json() && response.json().token;
                if (token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({username: username, token: token}));
                    return true;

                } else {
                    return false;
                }
            }).catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    static isLoggedIn(): boolean {
        let token: String = AuthenticationService.getToken();
        return token && token.length > 0;
    }

    static getToken(): String {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let token = currentUser && currentUser.token;
        return token ? token : "";
    }

    static logout(): void {
        // clear token remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}