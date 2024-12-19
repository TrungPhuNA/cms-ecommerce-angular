import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';
import { REGEX_EMAIL } from 'src/app/shared/constants/regex-data';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	host: { 'class': 'full-with-overflow-auto' }
})
export class FormComponent implements OnInit {

	breadcrumbs: any;
	title = 'Danh sách';
	data: any;
	id: any;
	submitted = false;
	listRoles = [];
	loading = false;

	statuses = STATUS_PRODUCTS;

	showPassword = false;

	types = [
		{
			value: "ADMIN",
			name: 'Admin',

		},
		{
			value: "USER",
			name: 'User',

		},
		{
			value: "SYSTEM",
			name: 'System',

		}
	];

	images = [new FileUploadModel(null, null, true, '')];

	form = new FormGroup({
		name: new FormControl(null, Validators.required),
		email: new FormControl(null, [
			Validators.required, Validators.pattern(REGEX_EMAIL),
			Validators.maxLength(255)]),
		phone: new FormControl(null,),
		roles: new FormControl(null),
		status: new FormControl(null, Validators.required),
		password: new FormControl(null, [
			Validators.required,
			Validators.minLength(8),
			Validators.maxLength(16),
			Validators.pattern(/^[A-Za-z0-9~`!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/]+$/)
		]),
		type_name: new FormControl(null, Validators.required),
		avatar: new FormControl(null)
	});


	validatorMessages = VALIDATOR_MESSAGES;


	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: AccountService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private uploadService: FileUploadService,
		private router: Router

	) {


	}
	ngOnInit(): void {
		this.showPassword = window.location.pathname?.includes('store')
		this.activeRoute.params.subscribe((res: any) => {
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb('Người dùng', '/account/user'),
				new Breadcrumb(res?.id ? 'Cập nhật' : 'Tạo mới', ''),
			];
			this.getListRoles({ page: 1, page_size: 1000 }, res?.id)

		});
	}

	getListRoles(filters: any, id?: any) {
		this.loading = true;
		this.service.getListRole(filters)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				if (res?.status == 'success') {
					this.listRoles = res?.data?.roles;
				}
				if (id) {
					this.getDetail(id)
				} else {
					this.loading = false;
				}
				
			})
	}

	getDetail(id: any) {
		this.service.showUser(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				this.showPassword = false;
				if (res?.status == 'success') {
					this.data = res?.data?.user;
					this.id = this.data?.id;

					if (this.data) {
						this.form.enable();
						this.form.patchValue({
							...this.data,
							roles: this.data?.roles_account?.map((item: any) => item?.id),
							type_name: this.data?.types?.find((item: any) => item != null)?.name
						});
						this.submitted = false;
						this.helperService.clearValidator(this.form, 'password')
						let avatar = this.helperService.buildImage(this.data?.avatar);
						this.images = [new FileUploadModel(null, avatar, true, avatar)];
					} else {
						this.alertService.fireSmall("error", ALERT_ERROR.not_found);
						this.form.disable();
					}
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.not_found)
				}
			})
	}

	submit() {
		this.submitted = true;

		if (this.form.invalid) {
			return;
		}
		let file = this.images[0]?.fileInfo;

		this.loading = true;
		if (file) {
			this.uploadService.upload(file).pipe((finalize(() => this.cdr.detectChanges())))
				.subscribe((res: any) => {
					if (res?.status == 'success') {
						this.form.patchValue({
							avatar: res?.data?.file_name
						});

						this.createOrUpdate();
					} else {
						this.alertService.fireSmall('error', res?.message);
						this.loading = false;
					}
				})
		} else {
			this.createOrUpdate();
		}

	}

	createOrUpdate() {
		this.service.createOrUpdateUser(this.form.value, this.data?.id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.submitted = false;
					
					this.alertService.fireSmall("success", this.data? ALERT_SUCCESS.update : ALERT_SUCCESS.create);
					// this.route
				} else {
					this.alertService.fireSmall("error", res?.message || (this.data? ALERT_ERROR.update : ALERT_ERROR.create))

				}
			})
	}

	getImages(e: any) {
		console.log(e);
		this.images = e;
	}


}

