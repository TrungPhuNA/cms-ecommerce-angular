import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService, AlertService, HelperService, OrderService, ProductService, WarehouseService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ALERT_SUCCESS } from 'src/app/shared';
import { PERMISSION_GROUPS } from 'src/app/shared/constants/permission';
import { VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';
import moment from 'moment';
import { IncomeComponent } from '../../income/income.component';

@Component({
	selector: 'app-form-stock-out',
	templateUrl: './form-stock-out.component.html',
	styleUrls: ['./form-stock-out.component.scss']
})
export class FormStockOutComponent implements OnInit {

	icon: any;
	title: any;
	content: any;
	clickSelect = false;

	typeWareHouse = [
		{
			value: 'final',
			name: 'Kho thành phẩm '
		},
		{
			value: 'ingredient',
			name: 'Kho nguyên liệu '
		}
	]

	form = new FormGroup({
		order_id: new FormControl(null, Validators.required),
		agency_id: new FormControl(null, Validators.required),
		transactions: new FormControl(null),
		type: new FormControl(null, Validators.required)
	});
	data: any;
	loading = false;
	submitted = false;

	listGroup = PERMISSION_GROUPS;

	validatorMessages = VALIDATOR_MESSAGES;

	dataType: any;

	


	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<IncomeComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		public helperService: HelperService,
		private orderService: OrderService,
		private service: WarehouseService
	) {
		this.data = data?.item;
		this.dataType = data?.type
		this.title = data?.title;
		if (this.data) {
			this.form.patchValue(this.data);
		}
	}

	userInfo: any;
	ngOnInit(): void {
		this.getListData();
		this.getListDataAgency();

		let data: any = localStorage.getItem('user');
		if (data) {
			this.userInfo = JSON.parse(data);
		}

	}

	listDataAgency = []
	getListDataAgency() {
		this.loading = true;
		let params = {
			page: 1, page_size: 10000,
		}
		this.service.getListData(params, 'agency')
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.listDataAgency = res?.data?.agencies?.map((item: any) => {
						return item;
					}) || [];
				}
			});
	}

	listData = []
	getListData() {
		this.loading = true;
		let params = {
			page: 1, page_size: 10000,
		}
		this.orderService.getListData(params)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.listData = res?.data?.orders?.map((item: any) => {
						item.title = `${item.id} - ${item.code}`
						return item;
					}) || [];
				}
			});
	}

	handleChangeOrder(e: any) {
		this.form.patchValue({
			transactions: e?.transactions
		})
	}

	onClose(status?: any) {
		this.form.reset();
		this.dialogRef.close({
			success: status,
			type: this.dataType
		});
	}

	submit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		let dataForm: any = {
			...this.form.value,
		}
		console.log(dataForm);
		dataForm.stock_out = dataForm?.transactions?.reduce((newData: any, item: any) => {
			newData.push({
				order_id: item.order_id,
				type: dataForm.type,
				date: moment().format('yyyy-MM-DD'),
				product_id: item.product_id,
				user_id: this.userInfo.id,
				quantity: item.qty,
				price: item.price,
			});
			return newData;
		}, []);
		this.loading = true;
		this.service.createOrUpdateData(dataForm, this.data?.id, 'stock-out/store')
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success' && res?.data?.stockOut) {
					this.submitted = false;
					this.alertService.fireSmall('success', this.data?.id ? ALERT_SUCCESS.update : ALERT_SUCCESS.create);
					this.onClose(true)
				} else {
					this.alertService.fireSmall('error', (res?.message != 'successfully' && res?.message) || (this.data?.id ? ALERT_SUCCESS.update : ALERT_SUCCESS.create));
				}
			})
	}

}

