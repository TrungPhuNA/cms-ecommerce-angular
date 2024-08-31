import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AlertService, FileUploadService, HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	loading: boolean = false;

	userInfo: any;
	userData: any;
	form: any = new FormGroup({
		phone: new FormControl(null, [Validators.required, Validators.maxLength(9)]),
		company_name: new FormControl(null, [Validators.required]),
		full_name: new FormControl(null, [Validators.required]),
		business_type: new FormControl(null, [Validators.required]),
		website_url: new FormControl(null, [Validators.required]),
		email: new FormControl(null, [Validators.required]),
		member_range: new FormControl(null, [Validators.required]),
		username: new FormControl(null)
	});

	base64Image: any;
	file: any;
	event_target: any;

	businessTypeName: any;
	memberRangeName: any;
	configs: any = this.configService.getSetting(); //{...CRM_CONFIG_DEFAULT};

	constructor(
		private authService: AuthService,
		private cdr: ChangeDetectorRef,
		private alertService: AlertService,
		private uploadService: FileUploadService,
		private configService: ConfigService,
		public helperService: HelperService,
        private dialog: MatDialog
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
				this.userInfo = res.data;
				this.form.patchValue({
					phone: this.userInfo?.phone || null,
					company_name: this.userInfo?.company?.company_name || null,
					full_name: this.userInfo?.full_name || null,
					business_type: this.helperService.genConfigDataByKey(this.configs, 'business_type', Number(this.userInfo?.company?.business_type || 0))?.name,
					website_url: this.userInfo?.company?.website_url || null,
					email: this.userInfo?.email || null,
					member_range: this.helperService.genConfigDataByKey(this.configs, 'member_range', Number(this.userInfo?.company?.member_range || 0))?.name,
					username: this.userInfo?.username || null
				});
				this.base64Image = this.userInfo?.avatar_url || null;
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
				// this.readFile(event.target);
				this.submit();
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
		this.uploadService.upload(this.file).subscribe(res => {
			if (res?.status == 'success') {
				this.authService.updateMe({ avatar_url: res.data?.file }).subscribe(response => {
					if (response?.status == 'success') {
						this.base64Image = response?.data?.avatar_url;
						this.userData = {...this.userInfo, avatar_url: response?.data?.avatar_url}
						localStorage.setItem('user_crm_info', JSON.stringify(this.userData));
						this.alertService.fireSmall('success', 'Cập nhật ảnh đại diện thành công!');
					} else this.alertService.fireSmall('error', response?.message || 'Có lỗi xảy ra!');
					this.loading = false;
					this.cdr.detectChanges();
				}, error => {
					this.loading = false;
					this.cdr.detectChanges();
				});
			} else this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
			this.cdr.detectChanges();
		}, error => {
			this.loading = false;
			this.cdr.detectChanges();
		});
	}


	linkToWeb() {
		if (this.form.value.website_url) window.open(this.form.value.website_url, '_blank');
	}

    openModal() {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '550px';
        dialogConfig.maxHeight = '90vh';
        dialogConfig.maxWidth = '90vw';
        dialogConfig.disableClose = true;
        let dialogRef = this.dialog.open(ModalComponent, dialogConfig);

        // action sau khi đóng modal
        dialogRef.afterClosed().subscribe((event: any) => {
            
        });
    }
}
