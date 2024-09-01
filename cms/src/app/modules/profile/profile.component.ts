import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertService, FileUploadService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { ConfigService } from 'src/app/services/config.service';
import { ALERT_SUCCESS } from 'src/app/shared';
import { DEFAULT_IMG } from 'src/app/shared/constants/crm-constant';
import { REGEX_EMAIL, REGEX_NAME } from 'src/app/shared/constants/regex-data';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

	loading: boolean = false;

	userInfo: any;
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
	});

	base64Image: any;
	file: any;
	event_target: any;
	fails: any = {
		email: null,
		phone: null,
		name: null
	};

	submitted = false;

	defaultImg = DEFAULT_IMG;


	constructor(
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService,
		private uploadService: FileUploadService,
		public helperService: HelperService,
		private dialog: MatDialog,
		private formValidatorService: FormValidatorService
	) {
		// let data: any = localStorage.getItem('user_crm_info');
		// this.userData = JSON.parse(data);
	}

	ngOnInit(): void {
		// this.listConfig();
		this.getInfo();

	}

	getInfo() {
		this.loading = true;
		this.authService.getMe().subscribe(res => {
			this.loading = false;
			if (res?.status == 'success') {
				this.userInfo = res.data?.user;
				this.form.patchValue({
					...res?.data?.user
				});
				this.base64Image = this.userInfo?.avatar || null;
			}
			this.cdr.detectChanges();
		}, error => {
			this.loading = false;
			this.cdr.detectChanges();
		});
	}


	onInputClick = (event: any) => {
		event.target.value = '';
	};

	onFileChanged(event: any) {
		if (event.target.files[0].type.indexOf('image') < 0) {
			this.alertService.fireSmall('error', 'File upload phải là file ảnh!');
		} else {
			this.event_target = event.target;
			this.file = event.target.files[0];
			if (this.file.size > 2097152) return this.alertService.fireSmall('warning', 'Vui lòng tải ảnh có dung lượng tối đa 2MB!');
			else {
				this.readFile(event.target);
			}
		}
	}

	readFile(inputValue: any): void {
		const file: File = inputValue.files[0];
		const myReader: FileReader = new FileReader();

		myReader.onloadend = (e) => {
			this.base64Image = myReader.result;
			this.cdr.detectChanges();
		};
		myReader.readAsDataURL(file);
	}

	submit() {
		this.loading = true;
		this.submitted = true;
		// if (this.file) {
		// 	this.uploadService.upload(this.file).subscribe(res => {
		// 		if (res?.status == 'success') {
		// 			let data = { ...this.form.value, avatar: res?.data?.file }
		// 			this.authService.updateMe(data).subscribe(response => {
		// 				this.loading = false;
		// 				if (response?.status == 'success') {
		// 					this.submitted = false;
		// 					this.alertService.fireSmall('success', 'Cập nhật ảnh đại diện thành công!');
		// 				} else this.alertService.fireSmall('error', response?.message || 'Có lỗi xảy ra!');
		// 				this.cdr.detectChanges();
		// 			});
		// 		} else
		// 			this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
		// 		this.cdr.detectChanges();
		// 	}, error => {
		// 		this.loading = false;
		// 		this.cdr.detectChanges();
		// 	});
		// } else {
			let data = { ...this.form.value }
			this.authService.updateMe(data).subscribe(response => {
				this.loading = false;

				if (response?.status == 'success') {
					this.submitted = false;
					this.userInfo = response?.data?.user;
					localStorage.setItem('user', JSON.stringify(this.userInfo));
					
					this.alertService.fireSmall('success', ALERT_SUCCESS.update, null, true)
				} else {
					this.alertService.fireSmall('error', response?.message || 'Có lỗi xảy ra!');
				}
				this.cdr.detectChanges();
			});
		// }
	}

	openModal() {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.width = '550px';
		dialogConfig.maxHeight = '90vh';
		dialogConfig.maxWidth = '90vw';
		dialogConfig.disableClose = true;
		// let dialogRef = this.dialog.open(ModalComponent, dialogConfig);

		// action sau khi đóng modal
		// dialogRef.afterClosed().subscribe((event: any) => {

		// });
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

	resetForm() {
		this.form.reset();
		this.form.patchValue({...this.userInfo});
		this.submitted = false;
		this.fails = {
			email: null,
			phone: null,
			name: null
		};
	}
}
