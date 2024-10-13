import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { ORDER_STATUSES, PAYMENT_STATUSES, STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';
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
	listProducts = [];
	loading = false;

	statuses = ORDER_STATUSES;
	paymentStatuses = PAYMENT_STATUSES;


	form = new FormGroup({
		user_id: new FormControl(null, Validators.required),
		amount: new FormControl(null),
		shipping_amount: new FormControl(null),
		discount_amount: new FormControl(null),
		sub_total: new FormControl(null),
		payment_status: new FormControl(null),
		products: new FormArray([]),
		status: new FormControl(null, Validators.required),
		tax_amount: new FormControl(null),
		notes: new FormControl(null)
	});


	validatorMessages = VALIDATOR_MESSAGES;

	get products() {
		return this.form.get('products') as FormArray;
	}

	
	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: ProductService,
		private productService: ProductService,
		private userService: AccountService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private uploadService: FileUploadService

	) {


	}
	ngOnInit(): void {
		this.getListProducts({ page: 1, page_size: 1000 });
		this.getListAccounts({ page: 1, page_size: 1000 });
		this.activeRoute.params.subscribe((res: any) => {
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb('Đơn hàng', '/order'),
				new Breadcrumb(res?.id ? 'Cập nhật' : 'Tạo mới', ''),
			];
			if (res?.id) {
				this.getDetail(res?.id);
			} else {
				this.initFormArray()
			}
		});
	}

	initFormArray(item?: any) {
		this.products.push(new FormGroup({
			id: new FormControl(null, Validators.required),
			price: new FormControl(null),
			quantity: new FormControl(null),
			total_price: new FormControl(null),
		}));
		this.cdr.detectChanges();
	}



	getListProducts(filters: any) {
		this.productService.getListData(filters)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				if (res?.status == 'success') {
					this.listProducts = res?.data?.products;
				}
			})
	}

	listAccounts: any = [];
	getListAccounts(filters: any) {
		this.userService.getListUser(filters)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				if (res?.status == 'success') {
					this.listProducts = res?.data?.products;
				}
			})
	}

	getDetail(id: any) {
		this.loading = true;
		this.service.showData(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.data = res?.data?.product;
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
		this.loading = true;
		this.createOrUpdateProduct();
	}

	createOrUpdateProduct() {
		this.service.createOrUpdateData(this.form.value, this.data?.id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.submitted = false;
					this.alertService.fireSmall("success", ALERT_SUCCESS.create)
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.create)

				}
			})
	}

	deleteData(index: any) {

	}

	renderPrice(index: any) {
		return {
			init_price: 0,
			price: 0
		};
	}


}
