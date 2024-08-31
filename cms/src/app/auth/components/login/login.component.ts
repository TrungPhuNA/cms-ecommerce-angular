import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "../../../services/auth.service";
import { environment } from "../../../../environments/environment";
import { AlertService, HelperService } from 'src/app/services';
import { isObject } from 'lodash';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { Helpers } from 'src/app/shared';
import moment from 'moment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: any = new FormGroup({
        username: new FormControl(null, [
			Validators.required, 
			this.FormValidatorService.usernameOrEmailValidator(),
            Validators.minLength(5)
			// Validators.pattern('^[a-z0-9_]+$')
		]),
        password: new FormControl(null, [Validators.required, Validators.minLength(5)])
    });
    hasError: boolean;
    returnUrl: string;
    isVerifyToken = false;
    disabledButton: boolean = true;

    showPw: boolean = false;

    fails: any;

    tracking_params: any;

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private cdr: ChangeDetectorRef,
        private alertService: AlertService,
		private FormValidatorService : FormValidatorService,
		public helperService: HelperService,
    ) {
        this.activatedRoute.queryParams.subscribe(res => {
            this.tracking_params = res;
        });
    }

    errors = {
        username: {
            required: 'Tên đăng nhập không được để trống.',
        },
        password: {
            required: 'Mật khẩu không được để trống.',
            minlength: 'Mật khẩu phải chứa ít nhất 5 ký tự.',
        },
    };

    get username() {
        return this.loginForm.get('username');
    }

    get password() {
        return this.loginForm.get('password');
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(params => {
            if (params.code && params.code !== '') {
				/*Login social*/

                this.isVerifyToken = true;
                this.authService.getAccessToken(params.code).subscribe((res: any) => {
					this.isVerifyToken = false;
                    if (res?.status == 'success') {
                        let userInfo: any = res.data;
                        localStorage.setItem('user_crm_info', JSON.stringify(userInfo));
						if(userInfo?.is_registering) {
							localStorage.setItem('login_type', 'social');
                        	this.route.navigate(['auth/register']);
						} else {
							if (res?.data) {
								this.authService.setDataAccount(res.data);
								this.authService.setJwtToken(this.authService.tokenField, res.data.access_token, res.data.expires_in);
								Helpers.prototype.setCookie(this.authService.loginCrmAdvKey, moment().format(), 7);
								this.route.navigate(['overview']);
							} else {
								this.helperService.removeLocalStorage('login_type');
								this.helperService.removeLocalStorage('user_crm_info');
							    this.alertService.fireSmallThen('error', res?.message || 'Đăng nhập thất bại.',1000).then(() => {
									this.authService.logoutWithoutCache({...this.tracking_params});
								})
							}
						}
                    } else if (res?.error_code == 99 || res?.error_code == 2) {
                        if (res?.data?.lastName && res?.data?.firstName) sessionStorage.setItem('crm_name', res?.data?.lastName + ' ' + res?.data?.firstName);
                        sessionStorage.setItem('crm_email', res?.data?.email);
                        sessionStorage.setItem('crm_phone', res?.data?.phone);
                        sessionStorage.setItem('crm_username', res?.data?.username);
                        sessionStorage.setItem('crm_password', this.loginForm.value.password);
                        sessionStorage.setItem('crm_userType', res?.data?.userType);
                        window.location.href = 'auth/update-user-information';
                    } else {
						this.helperService.removeLocalStorage('login_type');
						this.helperService.removeLocalStorage('user_crm_info');
						if(res?.message == 'Invalid authorization code: FOpvPt') {
							this.authService.logoutWithoutCache({...this.tracking_params});
						} else {
							this.alertService.fireSmallThen('error', res?.message || 'Đăng nhập thất bại.',1000).then(() => {
								this.authService.logoutWithoutCache({...this.tracking_params});
							});
						}
						
                    }
					this.cdr.detectChanges();
                });
            }
        });

        this.disabledButton = false;

        this.clearPubUser();
    }

    loginGoogle(event: Event) {
        event.preventDefault();
    }

    login() {
        this.loginForm.value.username = this.loginForm.value.username.toLowerCase();
        this.disabledButton = true;
        this.authService.login(this.loginForm.value).subscribe((res: any) => {
            if (res?.status == 'success') {
                this.fails = false;
                window.location.href = 'overview';
            } else if (res?.status == 'fail_validate' || res?.status == 'fail') {
                this.fails = res.data;
                this.disabledButton = false;
            } else if (res?.error_code == 99 || res?.error_code == 2) {
                this.disabledButton = false;
                if (res?.data?.lastName && res?.data?.firstName) sessionStorage.setItem('crm_name', res?.data?.lastName + ' ' + res?.data?.firstName);
                sessionStorage.setItem('crm_email', res?.data?.email);
                sessionStorage.setItem('crm_phone', res?.data?.phone);
                sessionStorage.setItem('crm_username', res?.data?.username);
                sessionStorage.setItem('crm_password', this.loginForm.value.password);
                sessionStorage.setItem('crm_userType', res?.data?.userType);
                window.location.href = 'auth/update-user-information';
            } else {
                this.disabledButton = false;
				let message = isObject(res?.message) ? Object.values(res?.message)[0] : res?.message;
				message = message?.replace('username', 'Tên đăng nhập')?.replace('password', 'Mật khẩu')
                this.alertService.fireSmall('error', message);
            }
            this.cdr.detectChanges();
        }, error => {
            this.disabledButton = false;
            this.cdr.detectChanges();
        });
    }

    showPassword() {
        this.showPw = !this.showPw;
    }

    onChange(event: any) {
        if (event?.target?.value) {
            if (this.fails?.username)
                this.fails.username = null;
            else if (this.fails?.password)
                this.fails.password = null;
        }
    }

    routeToRegister() {
        this.route.navigate(['auth/register'],
            {
                queryParams: { ...this.tracking_params }
            }
        );
    }

	loginSocial(provider: string) {
		this.authService.loginSocial(provider);
	}

    clearPubUser() {
        sessionStorage.removeItem('crm_name')
        sessionStorage.removeItem('crm_username');
        sessionStorage.removeItem('crm_password');
        sessionStorage.removeItem('crm_phone');
        sessionStorage.removeItem('crm_email');
        sessionStorage.removeItem('crm_userType');
    }
}
