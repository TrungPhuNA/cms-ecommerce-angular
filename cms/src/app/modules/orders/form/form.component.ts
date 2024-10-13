import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, OrderService, ProductService } from 'src/app/services';
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


	form: any = new FormGroup({
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
		private service: OrderService,
		private productService: ProductService,
		private userService: AccountService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private router: Router,
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
			id: new FormControl(item?.product_id, Validators.required),
			price: new FormControl(item?.price),
			qty: new FormControl(item?.qty),
			total_price: new FormControl(item?.total_price),
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
					this.listAccounts = res?.data?.users;
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
					this.data = res?.data?.order;
					if (this.data) {
						this.form.enable();
						this.form.patchValue({
							...this.data
						});
						this.data?.transactions?.forEach((e: any) => {
							this.initFormArray(e);
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
					this.alertService.fireSmall("success", ALERT_SUCCESS.create);
					this.router.navigate(['/order']);
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.create)

				}
			})
	}

	deleteData(index: any) {
		this.products.removeAt(index);
		this.countSubTotal();
	}

	changeProduct(event: any, i: number, type = 'product') {
		if (this.products.at(i)) {
			let quantity = 0;
			let productItem = this.products.value[i];
			let price = productItem?.price || 0;
			if (type == 'quantity') {
				quantity = Number(event?.target?.value || 0);
			} else {
				quantity = Number(productItem?.qty || 0);
				price = event?.price;
			}
			this.products.at(i).patchValue({
				price: price,
				total_price: Number(price || 0) * quantity
			});
			this.countSubTotal();
		}
	}

	countSubTotal() {
		let total_price = this.products?.value?.reduce((newTotal: any, item: any) => {
			newTotal += Number(item?.total_price || 0)
			return newTotal;
		}, 0);
		let shipping_amount = Number(this.form.value?.shipping_amount || 0)
		let discount_amount = Number(this.form.value?.discount_amount || 0)
		let tax_amount = Number(this.form.value?.tax_amount || 0);


		this.form.patchValue({
			sub_total: total_price + shipping_amount + tax_amount - discount_amount,
			amount: total_price
		});
	}

	renderPrice(index: any) {
		return {
			init_price: 0,
			price: 0
		};
	}


}
