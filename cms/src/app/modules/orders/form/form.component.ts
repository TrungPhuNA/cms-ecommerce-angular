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
	loadingInit = false;

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
			transaction_id: new FormControl(item?.id),
			price: new FormControl(item?.price ? this.helperService.insertComma(`${item?.price}`) : null),
			qty: new FormControl(item?.qty ? this.helperService.insertComma(`${item?.qty}`) : null),
			total_price: new FormControl(item?.total_price ? this.helperService.insertComma(`${item?.total_price}`) : null),
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
		this.loadingInit = true;
		this.service.showData(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				this.loadingInit = false;
				if (res?.status == 'success') {
					this.data = res?.data?.order;
					if (this.data) {
						this.form.enable();
						this.form.patchValue({
							...this.data,
							amount: this.helperService.insertComma(`${this.data?.amount}`),
							shipping_amount: this.helperService.insertComma(`${this.data?.shipping_amount}`),
							discount_amount: this.helperService.insertComma(`${this.data?.discount_amount}`),
							sub_total: this.helperService.insertComma(`${this.data?.sub_total}`),
							tax_amount: this.helperService.insertComma(`${this.data?.tax_amount || 0}`),
						});
						if(this.data?.transactions?.length > 0) {
							this.data?.transactions?.forEach((e: any) => {
								this.initFormArray(e);
							});
						} else {
							this.initFormArray();
						}
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
		let data = this.form.value;
		data.products = data.products.map((item: any) => {
			item.price = this.helperService.deleteComma(`${item.price}`);
			item.qty = this.helperService.deleteComma(`${item.qty}`);
			item.total_price = this.helperService.deleteComma(`${item.total_price}`);
			return item;
		});
		data.amount = this.helperService.deleteComma(`${data?.amount}`);
		data.shipping_amount = this.helperService.deleteComma(`${data?.shipping_amount}`);
		data.discount_amount = this.helperService.deleteComma(`${data?.discount_amount}`);
		data.sub_total = this.helperService.deleteComma(`${data?.sub_total}`);
		data.tax_amount = this.helperService.deleteComma(`${data?.tax_amount}`);
		this.service.createOrUpdateData(data, this.data?.id)
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
			let price = `${this.helperService.deleteComma(productItem?.price || 0)}`;
			let check = false;
			if (type == 'quantity') {
				quantity = Number(event?.target?.value || 0);
			} else {
				quantity = Number(productItem?.qty || 0);
				price = event?.price;
				let indexProduct = this.products?.value?.findIndex((e: any) => e?.id == event?.id);
				if(indexProduct >= 0 && indexProduct != i) {
					check = true;
					// let oldQuantity = this.products.at(indexProduct)?.value?.qty;
					// let newQuantity = Number(this.helperService.deleteComma(oldQuantity) + quantity);
					// console.log("update sản phẩm đã tồn tại--------> ", indexProduct, this.products.at(indexProduct)?.value);
					// this.products.at(indexProduct).patchValue({
					// 	qty: this.helperService.insertComma(``),
					// 	total_price: this.helperService.insertComma(`${Number(price || 0) * newQuantity}`)
					// });
					this.products.at(i)?.reset();
					this.alertService.fireSmall('warning', 'Sản phẩm của bạn đã có trong đơn hàng');
					return;
				}
			}
			if(!check) {
				this.products.at(i).patchValue({
					price: this.helperService.insertComma(price),
					total_price: this.helperService.insertComma(`${Number(price || 0) * quantity}`)
				});
			}
			this.countSubTotal();
		}
	}

	countSubTotal() {
		let total_price = this.products?.value?.reduce((newTotal: any, item: any) => {
			newTotal += Number(this.helperService.deleteComma(item?.total_price || 0))
			return newTotal;
		}, 0);
		let shipping_amount = Number(this.form.value?.shipping_amount || 0)
		let discount_amount = Number(this.form.value?.discount_amount || 0)
		let tax_amount = Number(this.form.value?.tax_amount || 0);
		console.log("total price--------> ", total_price);
		console.log("subtotal--------> ", total_price + shipping_amount + tax_amount - discount_amount);
		this.form.patchValue({
			sub_total: `${this.helperService.insertComma(`${total_price + shipping_amount + tax_amount - discount_amount}`)}`,
			amount: `${this.helperService.insertComma(`${total_price}`)}`
		});
	}

	renderPrice(index: any) {
		return {
			init_price: 0,
			price: 0
		};
	}


}
