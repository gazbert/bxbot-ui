import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

/**
 * Broken - does not seem to be invoked!
 */
@Injectable()
export class CanActivateAuthGuard implements CanActivate {

    constructor(private authService: AuthenticationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        if (this.authService.isLoggedIn()) {
            // logged in so return true
            return true;
        } else {
            // not logged in so redirect to login page with the return url and return false
            this.router.navigate(['/login']);
            return false;
        }
    }
}