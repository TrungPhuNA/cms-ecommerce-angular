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
import { STATUS_ERROR_API } from 'src/app/shared/constants/crm-constant';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: any = new FormGroup({
        email: new FormControl(null, [
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
    }

    errors = {
        email: {
            required: 'Tên đăng nhập không được để trống.',
        },
        password: {
            required: 'Mật khẩu không được để trống.',
            minlength: 'Mật khẩu phải chứa ít nhất 5 ký tự.',
        },
    };

    ngOnInit(): void {
        this.disabledButton = false;
    }

    login() {
        this.disabledButton = true;
        this.authService.login(this.loginForm.value).subscribe((res: any) => {
            if (res?.status == 'success') {
                this.fails = false;
				console.log(res?.data);
				localStorage.setItem('access_token', res?.data?.user?.access_token);
				localStorage.setItem('user', JSON.stringify(res?.data?.user));
				this.route.navigate(['/overview'])
            } else if (STATUS_ERROR_API.includes(res?.status)) {
                this.fails = res.data;
                this.disabledButton = false;
            } else {
                this.disabledButton = false;
				let message = isObject(res?.message) ? Object.values(res?.message)[0] : res?.message;
                this.alertService.fireSmall('error', message);
            }
            this.cdr.detectChanges();
        });
    }

    showPassword() {
        this.showPw = !this.showPw;
    }

    onChange(event: any) {
        if (event?.target?.value) {
            if (this.fails?.email)
                this.fails.email = null;
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

}
