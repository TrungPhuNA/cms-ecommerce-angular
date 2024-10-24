import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { finalize } from 'rxjs';
import { AccountService, AlertService, DashboardService, HelperService, ProductService } from 'src/app/services';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, HomeBreadcrumb } from 'src/app/shared';
import { DEFAULT_IMG, STATUS_PRODUCTS } from 'src/app/shared/constants/common';


@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

	loading: boolean = false;

	paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};

	dataMonths = [];
	dataYears = [];
	listData: any;

	defaultImg = DEFAULT_IMG;

	statuses = STATUS_PRODUCTS;

	months = moment().locale('vi').format('MM');
	year = moment().locale('vi').format('yyyy');


	searchForm: any = new FormGroup({
		from: new FormControl(moment().format('yyyy-MM-DD')),
		to: new FormControl(moment().format('yyyy-MM-DD')),
	});

	breadcrumbs: any;
	title = 'Overview';

	listTotalData = [
		{
			title: 'Người dùng',
			total: 0,
			prefix: '',
			url: '/account/user',
			key: 'total_user',
			icon: 'fa-circle-user fa-solid text-white fs-px-25',
			bgClass: 'bg-ABEFC6'
		},
		{
			title: 'Sản phẩm',
			total: 0,
			prefix: '',
			url: '/product',
			key: 'total_product',
			icon: 'fa-list fa-sharp-duotone fa-solid text-white fs-px-25',
			bgClass: 'bg-B2DDFF'
		},
		{
			title: 'Đơn hàng',
			total: 0,
			prefix: '',
			url: '/order',
			key: 'total_order',
			icon: 'fa-cart-plus fa-solid text-white fs-px-25',
			bgClass: 'bg-orange-v2'
		},
		{
			title: 'Doanh thu',
			total: 0,
			prefix: ' đ',
			url: '/order',
			key: 'total_revenue',
			icon: 'fa-solid fa-credit-card text-white fs-px-25',
			bgClass: 'bg-orange'
		}
	]

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: DashboardService,
		private cdr: ChangeDetectorRef,

	) {
		this.breadcrumbs = [
			new HomeBreadcrumb(),
			new Breadcrumb('Overview', '/overview'),
			new Breadcrumb('Thống kê', ''),
		];
	}

	ngOnInit(): void {
		this.search()
	}

	search() {
		this.paging.page = 1;
		this.getListData();
	}

	reset() {
		this.searchForm.reset();
		this.search()
	}

	getListData() {
		this.loading = true;
		let params = {
			...this.helperService.buildSearchValueByKeyFilter(this.searchForm.value)
		}
		this.service.getListData(params)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.listData = res?.data;
					console.log(this.listData);
					if(this.listData) {
						this.listTotalData = this.listTotalData.map((item: any) => {
							item.total = Number(this.listData[`${item.key}`])
							return item;
						});
						let year = moment().year();
						let month = moment().month() + 1;

						this.dataYears = Object.entries(this.listData?.order_month_in_year)?.reduce((newData: any, item: any) => {
							if(item?.length > 0) {
								let obj = {
									date: moment(`${year}-${item[0]}-01`).format('MMM'),
									value: item[1]
								}
								newData.push(obj);
							}
							return newData;
						}, []);
						this.dataMonths = Object.entries(this.listData?.order_day_in_month)?.reduce((newData: any, item: any) => {
							if(item?.length > 0) {
								let obj = {
									date: moment(`${year}-${month}-${item[0]}`).format('yyyy-MM-DD'),
									value: item[1]
								}
								newData.push(obj);
							}
							return newData;
						}, []);
						console.log(this.dataMonths, this.dataYears);
					}
				} else {
					this.alertService.fireSmall('error', res?.message)
				}
			});
	}
}
