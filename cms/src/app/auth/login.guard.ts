import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Helpers } from '../shared';
import { Router } from '@angular/router';
import { AuthService } from "../services/auth.service";


@Injectable({
    providedIn: 'root'
})


export class LoginGuard implements CanActivate {

    constructor(
        private auth: AuthService,
        private router: Router,
    ) {
    }

    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Promise((resolve) => {
            // setTimeout(() => {
                const isAuthenticated = Helpers.prototype.getCookie('jwt');
                if (isAuthenticated) {
                    // this.router.navigate(['overview']);
                    window.location.href = 'overview';
                    resolve(false);
                } else {
                    resolve(true);
                }
            // }, 0);
        });
    }
}
