import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AccountService, AlertService, HelperService, OrderService, ProductService } from 'src/app/services';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, HomeBreadcrumb } from 'src/app/shared';
import { DEFAULT_IMG, ORDER_STATUSES, PAYMENT_STATUSES, STATUS_PRODUCTS } from 'src/app/shared/constants/common';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

	loading: boolean = false;

	paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};
	listData: any = [];

	defaultImg = DEFAULT_IMG;

	statuses = ORDER_STATUSES;
	statusPayments = PAYMENT_STATUSES;


	searchForm: any = new FormGroup({
		user_id: new FormControl(null)
	});

	breadcrumbs: any;
	title = 'Danh sách';

	constructor(
		public helperService: HelperService,
		public userService: AccountService,
		private alertService: AlertService,
		private service: OrderService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,

	) {
		this.breadcrumbs = [
			new HomeBreadcrumb(),
			new Breadcrumb('Đơn hàng', '/order'),
			new Breadcrumb('Danh sách', ''),
		];
	}

	ngOnInit(): void {
		this.search();
		this.getListAccounts({page: 1, page_size: 1000})
	}

	search() {
		this.paging.page = 1;
		this.getListData();
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

	getListData() {
		this.loading = true;
		let params = {
			...this.paging,
			...this.helperService.buildSearchValueByKeyFilter(this.searchForm.value)
		}
		this.service.getListData(params)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.listData = res?.data?.orders?.map((item: any) => {
						let status = this.statuses.find((e: any) => e?.value == item?.status);
						let payment_status = this.statusPayments.find((e: any) => e?.value == item?.payment_status);
						item.status_name = status?.name;
						item.status_class = status?.className;
						item.payment_name = payment_status?.name;
						item.payment_class = payment_status?.className;
						return item;
					}) || [];
					this.paging = this.helperService.buildPaging(res?.data?.meta);
				}
			});
	}

	changePage(e: any) {
		this.paging.page = e;
		this.getListData();
	}

	reset() {
		this.searchForm.reset();
		this.paging.page = 1;
		this.getListData();
	}

	deleteData(item: any) {
		this.alertService.fireConfirm('Bạn chắc chắn muốn xóa sản phẩm này chứ ?', '', 'warning', 'Hủy', 'Xóa')
			.then((resAlert: any) => {
				if (resAlert?.isConfirmed) {
					this.loading = true;
					this.service.deleteData(item.id)
						.pipe((finalize(() => this.cdr.detectChanges())))
						.subscribe((res: any) => {
							this.loading = false;
							if (res?.status == 'success') {
								this.alertService.fireSmall('success', ALERT_SUCCESS.delete)
							} else {
								this.alertService.fireSmall('error', res?.message || ALERT_ERROR.delete)
							}
						})
				}
			})
	}

}
