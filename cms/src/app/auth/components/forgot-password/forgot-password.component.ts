import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { REGEX_EMAIL } from 'src/app/shared/constants/regex-data';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    form: any = new FormGroup({
        email: new FormControl(null, [
			Validators.required, 
			Validators.pattern(REGEX_EMAIL),
			Validators.maxLength(255)
		]),
    });

    disabledButton: boolean = false;

    completed: boolean = true;

    constructor(
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService,
		public helperService: HelperService,
        private gaService: GoogleAnalyticsService,
        private route: Router
    ) { }

    ngOnInit(): void {
    
    }

    submit() {
        if (!this.form.value.email) return this.alertService.fireSmall('warning', 'Email không được để trống!');
        else if (!REGEX_EMAIL.test(this.form.value.email)) return this.alertService.fireSmall('warning', 'Email không đúng định dạng!');
        else if (this.form.value.email.length > 255) return this.alertService.fireSmall('warning', 'Email không được vượt quá 255 kí tự!');

        this.disabledButton = true;
        this.authService.forgotPassword(this.form.value).subscribe(res => {
            if (res?.status == 'success') {
                localStorage.setItem('security_otp', 'true');
                this.route.navigate(['/auth/reset-password'], { queryParams: { email: this.form.value.email, code: res?.data?.token }});
            } else {
                if (res?.message == 'Max reset request 3 times per day.') this.alertService.fireSmall('error', 'Rất tiếc, bạn đã hết 3 lần nhận mã OTP/ngày, quay lại vào ngày mai hoặc liên hệ để được hỗ trợ');
                else this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
                this.disabledButton = false;
            }
            this.cdr.detectChanges();
        }, error => {
            this.disabledButton = false;
            this.cdr.detectChanges();
        });
    }
}
