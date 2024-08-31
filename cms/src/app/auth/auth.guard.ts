import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Helpers } from '../shared';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router,
    ) {
    }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve) => {
            // setTimeout(() => {
				resolve(true);

                // const isAuthenticated = Helpers.prototype.getCookie('jwt');
                // if (!isAuthenticated) {
                //     // this.router.navigate(['auth/login']);
                //     window.location.href = 'auth/login';
                //     resolve(false);
                // } else {
                //     resolve(true);
                // }
            // }, 0);
        });
    }
}
