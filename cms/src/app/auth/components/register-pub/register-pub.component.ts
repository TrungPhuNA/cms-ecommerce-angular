import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { isObject } from 'lodash';
import moment from 'moment';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { Helpers } from 'src/app/shared';
import { STATUS_ERROR_API } from 'src/app/shared/constants/crm-constant';
import { REGEX_LINK_V3, REGEX_NAME, REGEX_PHONE } from 'src/app/shared/constants/regex-data';

@Component({
    selector: 'app-register-pub',
    templateUrl: './register-pub.component.html',
    styleUrls: ['./register-pub.component.scss']
})
export class RegisterPubComponent implements OnInit {

    form: any = new FormGroup({
        phone_number: new FormControl(null, [
            Validators.required,
            Validators.pattern(REGEX_PHONE)
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
        email: new FormControl(null),
        member_range: new FormControl(null, [Validators.required]),
        username: new FormControl(null)
    });

    emailFromApi: any;

    disabledButton: boolean = false;
    disabledButtonComplete: boolean = false;
    configs: any = this.configService.getSetting();// { ...CRM_CONFIG_DEFAULT };

    fails: any = {
        email: null,
        phone_number: null,
        username: null
    };

    tracking_signup: any = {
        location: "web_portal",
        source_type: "FORM", // bên adv khi đăng ký
        source: null // có thể null hoặc điền utm_souce 
    };

    tracking_params: any;

    login_type: any;

    fullName: any;
    password: any;

    preUrl: string = 'https://';

    allowInputPhone: boolean = false;

    userType: any;

    constructor(
        private configService: ConfigService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        private alertService: AlertService,
		private helper: Helpers,
        public helperService: HelperService,
        private activatedRoute: ActivatedRoute,
        private gaService: GoogleAnalyticsService
    ) {
        let phone_number: any = sessionStorage.getItem('crm_phone');
        this.form.patchValue({
            username: sessionStorage.getItem('crm_username'),
            email: sessionStorage.getItem('crm_email'),
            full_name: sessionStorage.getItem('crm_name')
        });
        this.fullName = sessionStorage.getItem('crm_name');
        this.password = sessionStorage.getItem('crm_password');
        this.userType = sessionStorage.getItem('crm_userType');

        if (phone_number?.startsWith('+84')) this.form.patchValue({ phone_number: phone_number.replace('+84', '0') });
        else if (phone_number?.startsWith('84')) this.form.patchValue({ phone_number: phone_number.replace('84', '0') });
        else this.form.patchValue({ phone_number: phone_number == 'null' ? '' : phone_number });

        if (!REGEX_PHONE.test(this.form.value.phone_number)) this.allowInputPhone = true;

        if (!(this.form.value.username && this.form.value.email && this.password)) {
            this.clearPubUser();
            window.location.href = 'auth/login';
        }
    }

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe(res => {
            if (res?.utm_source) {
                this.tracking_signup.source = res.utm_source;
				this.helper.setCookie('utm_source', res?.utm_source, 30)
            }
            this.tracking_params = res;
        });

        this.form.get('full_name').markAsDirty();
        this.form.get('phone_number').markAsDirty();
    }

    register() {
        let data = { ...this.form.value };

        if (data?.phone_number?.startsWith('0')) {
            data.phone_number = '+84' + data.phone_number?.replace('0', '');
        }

        if (this.userType == 'TEMPORARY') data.userType = 'ADVERTISER';

        if (!(data?.website_url.startsWith('http://') || data?.website_url.startsWith('https://'))) data.website_url = this.preUrl + data?.website_url;

        let crm_utm_source = {...this.tracking_signup};
		if(!this.tracking_signup?.source) {
			let utm_source = this.helper.getCookie('utm_source');
			crm_utm_source.source = utm_source;
		}
		data.utm_source = crm_utm_source?.source;
        data.crm_utm_source = crm_utm_source;

        this.disabledButtonComplete = true;
        this.authService.registerPub(data).subscribe((res: any) => {
            this.disabledButtonComplete = false;
            if (res?.status == 'success') {
                this.gaService.sendEvent('login_register_form_success');
                this.fails = null;
                this.clearPubUser();
                this.alertService.fireSmall("success", "Cập nhật thông tin tài khoản thành công.", 3000);
                if (this.password == 'null') {
                    setTimeout(() => {                    
                        this.authService.setDataAccount(res.data);
                        this.authService.setJwtToken(this.authService.tokenField, res.data?.user?.token, res.data.expires_in);
                        Helpers.prototype.setCookie(this.authService.loginCrmAdvKey, moment().format(), 7);
                        window.location.href = 'overview';
                    }, 2000);
                } else {
                    this.authService.login({ username: this.form.value.username, password: this.password }).subscribe((resLogin: any) => {
                        if (resLogin?.status == 'success') {
                            this.gaService.sendEvent('login_normal_login_success', { username: resLogin?.data?.user_name });
                            setTimeout(() => {                    
                                window.location.href = 'overview';
                            }, 2000);
                        }
                        this.cdr.detectChanges();
                    });
                }
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

    onChange(event: any, key: any) {
        if (event?.target?.value && this.fails) {
            this.fails[`${key}`] = null;
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

    navigateToSignUp() {
        this.clearPubUser();
        window.location.href = 'auth/register';
    }

    clearPubUser() {
        sessionStorage.removeItem('crm_name')
        sessionStorage.removeItem('crm_username');
        sessionStorage.removeItem('crm_password');
        sessionStorage.removeItem('crm_phone');
        sessionStorage.removeItem('crm_email');
        sessionStorage.removeItem('crm_userType');
        sessionStorage.removeItem('utm_source');
		if(this.helper.getCookie('utm_source') &&  this.helper.getCookie('utm_source')!= '') {
			this.helper.deleteCookie('utm_source')
		}
    }
}
