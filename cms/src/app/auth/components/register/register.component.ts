import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject, trim } from 'lodash';
import { finalize } from 'rxjs';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { ConfigService } from 'src/app/services/config.service';
import { ALERT_SUCCESS, Helpers } from 'src/app/shared';
import { STATUS_ERROR_API } from 'src/app/shared/constants/crm-constant';
import { REGEX_EMAIL, REGEX_NAME,  } from 'src/app/shared/constants/regex-data';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	// host: { 'class': 'full-with-overflow-auto' }

})
export class RegisterComponent implements OnInit, OnDestroy {

	form: any = new FormGroup({
		phone: new FormControl(null, [
			Validators.required,
			this.formValidatorService.phoneNumberValidator()
		]),
		name: new FormControl(null, [
			Validators.required,
			Validators.pattern(REGEX_NAME),
			Validators.maxLength(50)
		]),
		email: new FormControl(null, [
			Validators.required,
			Validators.pattern(REGEX_EMAIL),
			Validators.maxLength(255)
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

	completed: boolean = false;

	disabledButton: boolean = false;
	disabledButtonComplete: boolean = false;
	showCfPw = false;

	fails: any = {
		email: null,
		phone: null,
		name: null
	};



	constructor(
		private configService: ConfigService,
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService,
		public helperService: HelperService,
		private helper: Helpers,
		private router: Router,
		private formValidatorService: FormValidatorService,
		private activatedRoute: ActivatedRoute,
	) {

	}

	disabledPhone = false;
	ngOnInit(): void {}

	/**
	 * NOTE message: 
	 * The email has already been taken.
	 * The phone number has already been taken.
	 */

	register() {
		let data = { ...this.form.value };

		this.disabledButtonComplete = true;
		this.authService.register(data)
		.pipe(finalize(() => this.cdr.detectChanges())).subscribe((res: any) => {
			this.disabledButtonComplete = false;
			if (res?.status == 'success') {
				this.alertService.fireSmall('success', ALERT_SUCCESS.register)
			} else if (STATUS_ERROR_API.includes(res?.status)) {
				let data = res?.data;
				if (data) {
					this.fails = Object.entries(data)?.reduce((newData: any, item: any) => {
						if (item?.length > 1) {
							if (item[1]) {
								newData[`${item[0]}`] = typeof item[1] == 'string' ? [item[1]] : item[1];
							}
						}
						return newData;
					}, {});
				}

				this.convertMessage('name');
				this.convertMessage('email');
				this.convertMessage('phone');
			} else {

				let message = isObject(res.message) ? Object.values(res.message)[0] : res.message;
				let count = 0;
				if (message?.includes('email')) {
					this.fails = {
						...this.fails,
						email: [message]
					};
					count++;
				}
				if (message?.includes('name')) {
					this.fails = {
						...this.fails,
						name: [message]
					};
					count++;
				}
				if (message?.includes('phone')) {
					this.fails = {
						...this.fails,
						phone: [message]
					};
					count++;
				}
				if (count <= 0) {
					this.alertService.fireSmall('error', message);
				} else {
					this.convertMessage('email');
					this.convertMessage('name');
					this.convertMessage('phone');
				}
			}
		});
	}

	navigateToEmail() {
	}

	showPw = false;
	showPassword(type: any) {
		if (type == 1) this.showPw = !this.showPw;
		else this.showCfPw = !this.showCfPw;
	}

	back() {
		if (this.completed) {
			this.disabledButton = false;
			this.completed = false;
		} else {
			this.router.navigate(['auth/login']);
		}
	}

	changeText(event: any, key: string) {
		if(event) {
			if(this.fails && this.fails[`${key}`]) {
				this.fails[`${key}`] = null;
			}
		}
	}

	onChange(event: any, key: any) {
		if (event?.target?.value && this.fails) {
			this.fails[`${key}`] = null;
		}
	}

	convertMessage(key: any) {
		if (this.fails && this.fails[`${key}`]?.length > 0 && ['email', 'phone', 'name']?.includes(key)) {
			this.fails[`${key}`] = this.fails[`${key}`]?.map((item: any) => {
				
				return item;
			});
		}
	}

	checkMatchPassword() {
		if (this.form.value.password && this.form.value.password_confirmation) {
			if (this.form.value.password === this.form.value.password_confirmation) return true;
			else return false;
		} else return true;
	}

	startCountdown(): void {
	}

	resendEmail() {

	}

	logout() {
		this.authService.logoutWithoutCache();
		this.router.navigate(['/auth/login'])
	}

	loginWithAccessToken(userInfo: any) {

	}

	ngOnDestroy(): void {}
}
