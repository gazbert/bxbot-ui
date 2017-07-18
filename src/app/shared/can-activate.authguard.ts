import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthenticationService} from "./authentication.service";

/**
 * FIXME - Broken - does not seem to get invoked and block the routes if the user is not logged in :-(
 */
@Injectable()
export class CanActivateAuthGuard implements CanActivate {

    constructor(private authService: AuthenticationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

        // stub for now
        return true;
        // if (AuthenticationService.isLoggedIn()) {
        //     return true;
        // } else {
        //     this.router.navigate(['/login']);
        //     return false;
        // }
    }
}