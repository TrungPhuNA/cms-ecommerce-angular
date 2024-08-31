import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject } from 'lodash';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { Helpers } from 'src/app/shared';
import { STATUS_ERROR_API } from 'src/app/shared/constants/crm-constant';
import { REGEX_USERNAME } from 'src/app/shared/constants/regex-data';

@Component({
	selector: 'app-active-account',
	templateUrl: './active-account.component.html',
	styleUrls: ['./active-account.component.scss']
})
export class ActiveAccountComponent implements OnInit {

	loading: boolean = false;

	formActive: any = new FormGroup({
		username: new FormControl(null, [
			Validators.required,
			Validators.minLength(6),
			Validators.maxLength(20),
			Validators.pattern(REGEX_USERNAME),
			this.helper.validateWhitespace
		]),
		password: new FormControl(null, [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(16),
			this.helper.validateWhitespace,
            Validators.pattern('^[A-Za-z0-9]+$')
        ]),
		password_confirmation: new FormControl(null, [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(16),
			this.helper.validateWhitespace])
	});

	disabledButton: boolean = false;
	token: any;

	showPw: boolean = false;
	showCfPw: boolean = false;

	passwordNotMatch: boolean;

	fails: any;

	checkCodeActive = false;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService,
		public helperService: HelperService,
		private helper: Helpers,
        private gaService: GoogleAnalyticsService
	) {
		this.token = this.activatedRoute.snapshot.paramMap.get('token');
	}

	get username() {
		return this.formActive.get('username');
	}

	get password() {
		return this.formActive.get('password');
	}

	get password_confirmation() {
		return this.formActive.get('password_confirmation');
	}

	ngOnInit(): void {
		this.checkActiveAccount();
	}

	checkActiveAccount() {
		this.loading = true;
		this.authService.checkActiveAccount({ activation_code: this.token }).subscribe(res => {
			this.loading = false;
			if (res?.status == 'success') {
				this.checkCodeActive = true;
				this.enableForm();
			} else {
				this.checkCodeActive = false;
				// this.disableForm();
				this.router.navigate(['error/404']);
			}
			this.cdr.detectChanges();
		}, error => {
			this.router.navigate(['error/404']);
			this.cdr.detectChanges();
		});
	}

	activeAccount() {
        if (!this.formActive.valid) return this.alertService.fireSmall('warning', 'Sai định dạng mật khẩu!');

		if (this.formActive.value.password !== this.formActive.value.password_confirmation) {
			this.alertService.fireSmall('warning', 'Mật khẩu và mật khẩu nhập lại không trùng khớp!');
			return;
		}

		this.formActive.value.username = this.formActive.value.username.toLowerCase();

		let data: any = {
			...this.formActive.value,
			activation_token: this.token
		};


		this.disabledButton = true;
		this.disableForm();
		this.authService.activeAccount(data).subscribe((res: any) => {
			if (res.status == 'success') {
                this.gaService.sendEvent('login_register_form_success');
				if(this.helper.getCookie('utm_source') &&  this.helper.getCookie('utm_source')!= '') {
					this.helper.deleteCookie('utm_source')
				}

				this.authService.login({ username: data?.username, password: data?.password }).subscribe(res => {
					if (res?.status == 'success') {
                        this.gaService.sendEvent('login_normal_login_success');
                        window.location.href = 'overview';
                    }
					this.cdr.detectChanges();
				}, error => {
					this.disabledButton = false;
					this.enableForm();
					this.cdr.detectChanges();
				});
			} else if (STATUS_ERROR_API.includes(res?.status)) {
				let data = res?.data;
				if(data) {
					this.fails = Object.entries(data)?.reduce((newData: any, item: any) => {
						if(item?.length > 1 ) {
							if(item[1]) {
								newData[`${item[0]}`] = typeof item[1] == 'string' ? [item[1]] : item[1];
							}
						}
							return newData;
					}, {});
					this.convertMessage('username');
					this.convertMessage('password');
				}
				this.disabledButton = false;
				this.enableForm();
			} else {
				this.disabledButton = false;
				this.enableForm();
				let message = isObject(res.message) ? Object.values(res.message)[0] : res.message;
				let count = 0;
				if (message?.includes('username')) {
					this.fails = {
						...this.fails,
						username: [`Tên đăng nhập ${message?.includes('taken') ? 'đã tồn tại' : 'không đúng định dạng'}`]
					};
					count++;
				}
				if (message?.includes('password')) {
					this.fails = {
						...this.fails,
						password: ["Mật khẩu không đúng định dạng"]
					};
					count++;
				}
				if(!count) {
					this.alertService.fireSmall('error', isObject(res.message) ? Object.values(res.message)[0] : res.message);
				}

			}
			this.cdr.detectChanges();
		}, error => {
			this.disabledButton = false;
			this.enableForm();

			this.cdr.detectChanges();
		});
	}

	showPassword(type: any) {
		if (type == 1) this.showPw = !this.showPw;
		else this.showCfPw = !this.showCfPw;
	}

	checkMatchPassword() {
		if (this.formActive.value.password && this.formActive.value.password_confirmation) {
			if (this.formActive.value.password === this.formActive.value.password_confirmation) return true;
			else return false;
		} else return true;
	}

	onChange(event: any) {
		if (event?.target?.value) {
			if (this.fails?.username)
				this.fails.username = null;
			else if (this.fails?.password)
				this.fails.password = null;
			else if (this.fails?.password_confirmation)
				this.fails.password_confirmation = null;
		}
	}

	disableForm() {
		this.formActive.disable();
		this.username.disable();
		this.password.disable();
		this.password_confirmation.disable();
	}
	enableForm() {
		this.formActive.enable();
		this.username.enable();
		this.password.enable();
		this.password_confirmation.enable();
	}

	convertMessage(key: any) {
		if (this.fails && this.fails[`${key}`]?.length > 0 && ['username', 'password']?.includes(key)) {
			this.fails[`${key}`] = this.fails[`${key}`]?.map((item: any) => {
				if (item?.includes('taken')) {
					item = key == 'username' ? 'Tên đăng nhập đã tồn tại' : 'Mật khẩu không đúng định dạng';
				} else if(item) {
					item = key == 'username' ? 'Tên đăng nhập đã tồn tại' : 'Mật khẩu không đúng định dạng';
				}
				return item;
			});
		}
	}

	changeText(event: any, key: string) {
		if(event) {
			if(this.fails && this.fails[`${key}`]) {
				this.fails[`${key}`] = null;
			}
		}
	}
}