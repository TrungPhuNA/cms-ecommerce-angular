import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

	breadcrumbs: any;
	title = 'Danh sách';
	data: any;
	id: any;
	submitted = false;
	listCategories = [];
	loading = false;

	statuses = STATUS_PRODUCTS;

	images = [new FileUploadModel(null, null, true, '')];

	form = new FormGroup({
		name: new FormControl(null, Validators.required),
		permissions: new FormControl(null, Validators.required),
		guard_name: new FormControl('api'),
	});


	validatorMessages = VALIDATOR_MESSAGES;

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: AccountService,
		private categoryService: CategoryService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private router: Router,
		private uploadService: FileUploadService

	) {


	}
	ngOnInit(): void {
		this.activeRoute.params.subscribe((res: any) => {
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb('Role', '/account/setting/role/list'),
				new Breadcrumb(res?.id ? 'Cập nhật' : 'Tạo mới', ''),
			];
			if (res?.id) {
				this.getDetail(res?.id);
			}
		});
	}

	getListCategory(filters: any) {
		this.categoryService.getListData(filters)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				if (res?.status == 'success') {
					this.listCategories = res?.data?.categories;
				}
			})
	}

	getDetail(id: any) {
		this.loading = true;
		this.service.showRole(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.data = res?.data?.role;
					if (this.data) {
						this.form.enable();
						this.form.patchValue({
							...this.data
						});
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
		this.createOrUpdateProduct();

	}

	createOrUpdateProduct() {
		this.service.createOrUpdateRole(this.form.value, this.data?.id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.submitted = false;
					this.alertService.fireSmall("success", ALERT_SUCCESS.create);
					this.router.navigate(['/account/setting/role/list'])
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.create)

				}
			})
	}
}

