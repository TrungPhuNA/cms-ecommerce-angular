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
			const access_token = localStorage.getItem('access_token');
			if (access_token && access_token != '') {
				resolve(true);
			} else {
				resolve(false);
			}
        });
    }
}
