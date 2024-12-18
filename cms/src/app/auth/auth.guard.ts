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

	canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
		const access_token = localStorage.getItem('access_token');
		
		if (access_token && access_token != '') {
			this.auth.getMe().subscribe((res: any) => {
				if(res?.status == 'success') {
					this.auth.currentUserSubject.next(res?.data?.user)
				}
			})
			return true;
		} 
		this.router.navigate(['/auth/login'])
		return false;
	}
}
