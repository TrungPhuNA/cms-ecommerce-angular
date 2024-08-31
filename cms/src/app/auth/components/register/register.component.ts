import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject, trim } from 'lodash';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { ConfigService } from 'src/app/services/config.service';
import {  Helpers } from 'src/app/shared';
import { STATUS_ERROR_API } from 'src/app/shared/constants/crm-constant';
import { REGEX_EMAIL, REGEX_LINK, REGEX_LINK_V3, REGEX_NAME, REGEX_PHONE_VN, REGEX_USERNAME } from 'src/app/shared/constants/regex-data';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss'],
	// host: { 'class': 'full-with-overflow-auto' }

})
export class RegisterComponent implements OnInit, OnDestroy {

	form: any = new FormGroup({
		phone_number: new FormControl(null, [
			Validators.required, 
			this.formValidatorService.phoneNumberValidator()
		]),
		company_name: new FormControl(null, [
			Validators.required, 
			Validators.maxLength(100)
		]),
		full_name: new FormControl(null, [
			Validators.required, 
			Validators.pattern(REGEX_NAME),
			Validators.maxLength(50)
		]),
		business_type: new FormControl(null, [
			Validators.required
		]),
		website_url: new FormControl(null, [
			Validators.required, 
			Validators.pattern(REGEX_LINK_V3),
			Validators.maxLength(255)
		]),
		email: new FormControl(null, [
			Validators.required, 
			Validators.pattern(REGEX_EMAIL),
			Validators.maxLength(255)
		]),
		member_range: new FormControl(null, [Validators.required]),
        username: new FormControl(null)
	});

	completed: boolean = false;

	emailFromApi: any;

	disabledButton: boolean = false;
    disabledButtonComplete: boolean = false;
	configs: any = this.configService.getSetting();// { ...CRM_CONFIG_DEFAULT };

	fails: any = {
		email: null,
		phone_number: null,
		username: null
	};

    isCount: boolean = false;
    
    countdown: number;
    interval: any;

    tracking_signup: any = {
        location: "web_portal",
        source_type: "FORM", // bên adv khi đăng ký
        source: null // có thể null hoặc điền utm_souce 
    };
    
    tracking_params: any;

	login_type: any;

    preUrl: string = 'https://';

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
	ngOnInit(): void {
		this.activatedRoute.queryParams.subscribe(res => {
            if(res?.utm_source) {
                this.tracking_signup.source = res.utm_source;
				this.helper.setCookie('utm_source', res?.utm_source, 30);
            }
			this.tracking_params = res; 
			this.login_type = localStorage.getItem('login_type');
			if(this.login_type == 'social') {
				let userInfo = this.helperService.getLocalStorage('user_crm_info');
				if(userInfo?.is_registering) {
					this.helperService.clearValidator(this.form, 'email');
					this.helperService.addValidatorForm(this.form, 'username', [
						Validators.required, 
						Validators.minLength(6),
						Validators.maxLength(20),
						Validators.pattern(REGEX_USERNAME)
					]);

					if(userInfo?.is_updated) {
						let phone_number = userInfo?.user?.profile?.phone_number || userInfo?.phone;
						if(phone_number) {
							phone_number = phone_number.replace('+84', '');
						}
						this.form.patchValue({
							username: userInfo?.user?.username || userInfo?.user_name,
							company_name: userInfo?.company?.name,
							phone_number: phone_number
						});
						this.helperService.disableForm(this.form, 'username');
						if(phone_number) {
							this.disabledPhone = true;
					        this.helperService.clearValidator(this.form, 'phone_number');
							this.helperService.disableForm(this.form, 'phone_number');
						} else {
                            this.helperService.addValidatorForm(this.form, 'phone_number', [
                                Validators.required, 
                                this.formValidatorService.phoneNumberValidator()
                            ]);
                        }
					}
					this.form.patchValue({
						email: userInfo?.email
					});

					this.helperService.disableForm(this.form, 'email');
				} else {
					this.helperService.removeLocalStorage('user_crm_info');
					this.helperService.removeLocalStorage('login_type');
					this.login_type = null;
					this.authService.logoutWithoutCache();
				}
				
			} else {
				this.helperService.clearValidator(this.form, 'username');
				this.helperService.addValidatorForm(this.form, 'email', [
					Validators.required, 
					Validators.pattern(REGEX_EMAIL),
					Validators.maxLength(255)
				]);
				this.helperService.enableForm(this.form, 'email');
				this.helperService.enableForm(this.form, 'phone_number');


			}
        });
		// this.form.valueChanges.subscribe((res: any) => {
		// 	this.captchaToken = '';
		// });
	}

	/**
	 * NOTE message: 
	 * The email has already been taken.
	 * The phone number has already been taken.
	 */

	register() {
		if(!this.captchaToken && this.login_type != 'social') {
			this.alertService.fireSmall('error', 'Vui lòng xác minh hình ảnh captcha');
			return;
		}
		let data = {...this.form.value};

        if (!(data?.website_url.startsWith('http://') || data?.website_url.startsWith('https://'))) data.website_url = this.preUrl + data?.website_url;

		if(data?.phone_number?.startsWith('0')) {
			data.phone_number = '+84' + data.phone_number?.replace('0', '');
		}

		let userInfo = this.helperService.getLocalStorage('user_crm_info');
		if(this.login_type == 'social') {
			data.email = userInfo?.email;
			if(userInfo?.is_updated) {
				data.username = userInfo?.user?.username || userInfo?.user_name;
				data.identify_id = userInfo?.user?.id;

				let phone_number = userInfo?.user?.profile?.phone_number || userInfo?.phone;
				if(phone_number) {
					phone_number = phone_number.replace('+84', '');
				}
				data.phone_number = this.form.value?.phone_number || phone_number;
				data.old_phone_number = phone_number;
			}
			data.is_updated = userInfo?.is_updated;
			data.sso_id = userInfo?.user_id || userInfo?.user?.sso_id
		} else {
			data.captcha_token = this.captchaToken;
		}
		let crm_utm_source = {...this.tracking_signup};
		if(!this.tracking_signup?.source) {
			let utm_source = this.helper.getCookie('utm_source');
			crm_utm_source.source = utm_source;
		}
		data.utm_source = crm_utm_source?.source;
        data.crm_utm_source = crm_utm_source;


		this.disabledButtonComplete = true;
		this.authService.register(data, this.login_type).subscribe((res: any) => {
			this.disabledButtonComplete = false;
			if (res?.status == 'success') {
				if(this.helper.getCookie('utm_source') &&  this.helper.getCookie('utm_source')!= '') {
					this.helper.deleteCookie('utm_source')
				}
				this.fails = null;
				if(this.login_type == 'social') {
					this.alertService.fireSmall("success", "Đăng ký tài khoản thành công.");
					
					if(userInfo?.is_updated) {
						this.loginWithAccessToken(userInfo);
					} else {
						this.loginWithAccessToken(res?.data);
					}
					// this.authService.logoutWithoutCache(this.tracking_params);
				} else {
					this.completed = true;
					this.emailFromApi = res.data.email;
					this.startCountdown();
				}
               
				
			} else if ( STATUS_ERROR_API.includes(res?.status)) {
				if(this.login_type != 'social') { 
					grecaptcha.reset();
					this.captchaToken = null;
				}
				
				let data = res?.data;
				if(data) {
					this.fails = Object.entries(data)?.reduce((newData: any, item: any) => {
						if(item?.length > 1) {
							// console.log(typeof item[1]);
							if(item[1]) {
								newData[`${item[0]}`] = typeof item[1] == 'string' ? [item[1]] : item[1];
							}
						}
							return newData;
					}, {});
				}
				
				this.convertMessage('username');
				this.convertMessage('email');
				this.convertMessage('phone_number');
			} else {
				if(this.login_type != 'social') { 
					grecaptcha.reset();
					this.captchaToken = null;
				}
				let message = isObject(res.message) ? Object.values(res.message)[0] : res.message;
				let count = 0;
				if (message?.includes('email')) {
					this.fails = {
						...this.fails,
						email: [message]
					};
					count++;
				}
				if (message?.includes('username')) {
					this.fails = {
						...this.fails,
						username: [message]
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
					this.convertMessage('username');
					this.convertMessage('phone_number');
				}
			}
			this.cdr.detectChanges();
		}, error => {
            this.disabledButtonComplete = false;
			this.cdr.detectChanges();
		});
	}

	navigateToEmail() {
		window.open('https://mail.google.com', '_blank');
	}

	back() {
		if (this.completed) {
			this.disabledButton = false;
			this.completed = false;
		} else {
			this.authService.logoutWithoutCache({ ...this.tracking_params });
			// this.router.navigate(['auth/login'], { queryParams: { ...this.tracking_params }});
		}
	}

	onChange(event: any, key: any) {
		if (event?.target?.value && this.fails) {
			this.fails[`${key}`] = null;
			// this.captchaToken = null;
			
		}
	}

	convertMessage(key: any) {
		if (this.fails && this.fails[`${key}`]?.length > 0 && ['email', 'phone_number', 'username']?.includes(key)) {
			this.fails[`${key}`] = this.fails[`${key}`]?.map((item: any) => {
				if (item?.includes('been taken')) {
					item = key == 'email' ? 'Email đã tồn tại.' : `${key == 'username' ? 'Tên đăng nhập' : 'Số điện thoại'} đã tồn tại.`;
				}
				return item;
			});
		}
	}

    startCountdown(): void {
        this.isCount = true;
        this.disabledButton = true;
        this.countdown = 60;

        this.interval = setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                localStorage.setItem('countdown', this.countdown.toString());
                this.cdr.detectChanges();
            } else {
                this.isCount = false;
                this.disabledButton = false;
                clearInterval(this.interval);
                localStorage.removeItem('countdown');
                this.cdr.detectChanges();
            }
        }, 1000);
    }

    resendEmail() {
        this.authService.resendActive({ email: this.emailFromApi }).subscribe((res: any) => {
            if (res?.status == 'success') {
                this.startCountdown();
                this.alertService.fireSmall('success', 'Gửi lại email thành công! Vui lòng kiểm tra hòm thư của bạn');
            } else {
                this.disabledButton = false;
                this.alertService.fireSmall('error', res?.message);
            }
            this.cdr.detectChanges();
        }, error => {
            this.disabledButton = false;
            this.cdr.detectChanges();
        });
    }

	logout() {
		this.authService.logoutWithoutCache()
	}

	loginWithAccessToken(userInfo: any) {
		this.authService.loginByAccessToken(userInfo).subscribe((res: any) => {
			if (res?.status == 'success') {
				this.fails = false;
				window.location.href = 'overview';
			} else if (res?.status == 'fail_validate' || res?.status == 'fail') {
				this.fails = res.data;
				this.disabledButton = false;
			} else {
				this.disabledButton = false;
				let message = isObject(res?.message) ? Object.values(res?.message)[0] : res?.message;
				message = message?.replace('username', 'Tên đăng nhập')?.replace('password', 'Mật khẩu')
				this.alertService.fireSmall('error', message);
			}
			this.cdr.detectChanges();
		});
	}

	captchaKey: any = this.authService.getCaptchaKey();
  	captchaToken: any;
	resolved(captchaResponse: any) {
		if (captchaResponse) { this.captchaToken = captchaResponse; }
	  }

    ngOnDestroy(): void {
        clearInterval(this.interval);
    }
}
