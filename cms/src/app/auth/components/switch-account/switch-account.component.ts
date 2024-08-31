import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-switch-account',
	templateUrl: './switch-account.component.html',
	styleUrls: ['./switch-account.component.scss']
})
export class SwitchAccountComponent implements OnInit {

	constructor(
		private router: Router,
		private authService: AuthService,
		private activatedRoute: ActivatedRoute,
		private cdr: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe((res: any) => {
			if(res?.token) {
				this.switchAccount(res?.token)
			} else {
				this.router.navigate(['/auth/login'])
			}
		})
	}

	switchAccount(token: any) {
		this.authService.switchAccount(token).subscribe((res: any) => {
			if(res?.status == 'success') {
				this.router.navigate([''])
			} else {
				this.authService.logout();
				this.router.navigate(['/auth/login'])
			}
		})
	}
}
