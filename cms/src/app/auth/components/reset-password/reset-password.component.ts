import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

    form: any = new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern('^[A-Za-z0-9]+$')]),
        password_confirmation: new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });
    hasError: boolean;
    returnUrl: string;
    isVerifyToken = false;
    disabledButton: boolean = false;
    disabledButtonOtp: boolean = false;

    showPw: boolean = false;
    showConfirmPw: boolean = false;

    fails: any;

    tracking_params: any;

    token: any;

    email: any;
    inputOtp: any;
    passOtp: boolean = false;

    isCount: boolean = false;
    countdown: number;
    interval: any;

    isPassOtp: any;

    constructor(
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private cdr: ChangeDetectorRef,
        private alertService: AlertService,
        private FormValidatorService: FormValidatorService,
        public helperService: HelperService,
        private gaService: GoogleAnalyticsService
    ) {
        this.activatedRoute.queryParams.subscribe(res => {
            this.email = res?.email;
            this.token = res?.code;
            if (res?.is_otp) this.isPassOtp = res.is_otp;
            if (res?.otp) this.inputOtp = res.otp;
        });
    }

    errors = {
        password: {
            required: 'Mật khẩu không được để trống.',
            minlength: 'Mật khẩu phải chứa ít nhất 8 ký tự.',
        },
    };

    get password() {
        return this.form.get('password');
    }

    get password_confirmation() {
        return this.form.get('password_confirmation')
    }

    ngOnInit(): void {
        this.disabledButton = false;

        if (localStorage.getItem('security_otp')) this.startCountdown();
    }

    onChange(event: any) {
        if (event?.target?.value) {
            if (this.fails?.password)
                this.fails.password = null;
        }
    }

    submitOtp() {
        if (!this.inputOtp) return;

        let data: any = {
            confirmOtp: this.inputOtp,
            token: this.token
        }

        this.disabledButtonOtp = true;
        this.authService.verifyOtp(data).subscribe(res => {
            if (res?.status == 'success') {
                window.location.href = `/auth/reset-password?email=${this.email}&code=${this.token}&is_otp=yes&otp=${this.inputOtp}`;
                // this.route.navigate(['/auth/reset-password'], {
                //     queryParams: {
                //         email: this.email,
                //         code: this.token,
                //         is_otp: 'yes',
                //         otp: this.inputOtp
                //     }
                // });
            } else {
                if (res?.message == 'token is invalid or expired!' || res?.message == 'confirmOtp is invalid.') 
                    this.alertService.fireSmall('error', 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng thử lại');
                else this.alertService.fireSmall('error', res?.message);
            }
            this.disabledButtonOtp = false;
            this.cdr.detectChanges();
        }, error => {
            this.disabledButtonOtp = false;
            this.cdr.detectChanges();
        });
    }

    startCountdown(): void {
        this.isCount = true;
        if (!localStorage.getItem('countdown-otp')) this.countdown = 60;
        else this.countdown = Number(localStorage.getItem('countdown-otp'));

        this.interval = setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
                localStorage.setItem('countdown-otp', this.countdown.toString());
                this.cdr.detectChanges();
            } else {
                this.isCount = false;
                clearInterval(this.interval);
                localStorage.removeItem('countdown-otp');
                localStorage.removeItem('security_otp');
                this.cdr.detectChanges();
            }
        }, 1000);
    }

    resendOtp() {
        this.authService.forgotPassword({ email: this.email }).subscribe(res => {
            if (res?.status == 'success') {
                this.token = res?.data?.token;
                this.route.navigate(['/auth/reset-password'], { queryParams: { email: this.email, code: this.token }});
                localStorage.setItem('security_otp', 'true');
                this.startCountdown();
                this.alertService.fireSmall('success', 'Gửi lại mã thành công! Vui lòng kiểm tra email.');
            } else {
                if (res?.message == 'Max reset request 3 times per day.') this.alertService.fireSmall('error', 'Rất tiếc, bạn đã hết 3 lần nhận mã OTP/ngày, quay lại vào ngày mai hoặc liên hệ để được hỗ trợ');
                else this.alertService.fireSmall('error', res?.message);
            }
            this.cdr.detectChanges();
        }, error => {
            this.cdr.detectChanges();
        });
    }

    showPassword(type: any) {
        if (type == 1) this.showPw = !this.showPw;
        if (type == 2) this.showConfirmPw = !this.showConfirmPw;
    }

    checkMatchPassword() {
        if (this.form.value.password && this.form.value.password_confirmation) {
            if (this.form.value.password === this.form.value.password_confirmation) return true;
            else return false;
        } else return true;
    }

    changeText(event: any, key: string) {
        if (event) {
            if (this.fails && this.fails[`${key}`]) {
                this.fails[`${key}`] = null;
            }
        }
    }

    submitNewPassword() {
        if (!this.form.valid) return this.alertService.fireSmall('warning', 'Sai định dạng mật khẩu!');

        let data: any = {
            ...this.form.value,
            token: this.token,
            otp: this.inputOtp,
        };

        this.disabledButton = true;
        this.authService.resetPassword(data).subscribe(res => {
            if (res?.status == 'success') {
                this.alertService.fireSmall('success', 'Đổi mật khẩu thành công! Vui lòng đăng nhập để tiếp tục.');
                setTimeout(() => {
                    this.disabledButton = false;
                    window.location.href = '/auth/login';
                }, 3000);
            } else {
                if (res?.message == 'token is invalid or was expired.') this.alertService.fireSmall('error', 'Mã xác thực không tồn tại hoặc đã hết hạn. Vui lòng thử lại');
                else this.alertService.fireSmall('error', res?.message);
                this.disabledButton = false;
            }
            this.cdr.detectChanges();
        }, error => {
            this.disabledButton = false;
            this.cdr.detectChanges();
        });
    }
}
