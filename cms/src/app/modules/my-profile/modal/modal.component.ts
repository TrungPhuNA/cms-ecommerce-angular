import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IndexComponent } from '../index/index.component';
import { AlertService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Helpers } from 'src/app/shared';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    loading: boolean = false;

    form: any = new FormGroup({
        password_old: new FormControl(null, [
            Validators.required,
            this.helper.validateWhitespace
        ]),
        password_new: new FormControl(null, [
            Validators.required,
            Validators.minLength(8),
            this.helper.validateWhitespace,
            Validators.pattern('^[A-Za-z0-9]+$')
        ]),
        confirm_new_password: new FormControl(null, [
            Validators.required
        ]),
    });

    fails: any;

    errorPasswordOld: any;

    get password_old() {
        return this.form.get('password_old');
    }

    get password_new() {
        return this.form.get('password_new');
    }

    get confirm_new_password() {
        return this.form.get('confirm_new_password');
    }

    constructor(
        private dialogRef: MatDialogRef<IndexComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private alertService: AlertService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef,
        public helperService: HelperService,
        private helper: Helpers,
    ) {

    }

    ngOnInit(): void {

    }

    onClose() {
        this.dialogRef.close();
    }

    submit() {
        if (!this.form.valid) return this.alertService.fireSmall('warning', 'Sai định dạng mật khẩu!');

        if (!this.checkMatchPassword()) return this.alertService.fireSmall('error', 'Mật khẩu và mật khẩu nhập lại không trùng khớp');
        if (!this.checkMatchOldPassword()) return this.alertService.fireSmall('error', 'Mật khẩu hiện tại và mật khẩu mới không được trùng nhau');

        let data: any = {
            password_old: this.form.value.password_old,
            password_new: this.form.value.password_new,
        };

        this.loading = true;
        this.authService.updatePassword(data).subscribe(res => {
            if (res?.status == 'success') {
                this.alertService.fireSmall('success', 'Đổi mật khẩu thành công!');
                this.onClose();
            } else {
                if (res?.message == 'Mật khẩu cũ không khớp') this.errorPasswordOld = 'Mật khẩu hiện tại không đúng';
                else this.alertService.fireSmall('error', res?.message);
            }
            this.loading = false;
            this.cdr.detectChanges();
        }, error => {
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    showPw: boolean = false;
    showNewPw: boolean = false;
    showConfirmNewPw: boolean = false;
    showPassword(type: any) {
        if (type == 1) this.showPw = !this.showPw;
        if (type == 2) this.showNewPw = !this.showNewPw;
        if (type == 3) this.showConfirmNewPw = !this.showConfirmNewPw;
    }

    checkMatchPassword() {
        if (this.form.value.password_new && this.form.value.confirm_new_password) {
            if (this.form.value.password_new === this.form.value.confirm_new_password) return true;
            else return false;
        } else return true;
    }

    checkMatchOldPassword() {
        if (this.form.value.password_new && this.form.value.password_old) {
            if (this.form.value.password_new !== this.form.value.password_old) return true;
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
}
