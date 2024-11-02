import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { finalize } from 'rxjs';
import { AccountService, AlertService, DashboardService, HelperService, ProductService } from 'src/app/services';
import { ExcelService } from 'src/app/services/common/excel.service';
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

	listInOutProduct: any = [];

	listTotalData = [
		{
			title: 'Số lượng hàng hóa',
			total: 0,
			prefix: '',
			url: '/product',
			key: 'total_product_quantity',
			icon: 'fa-cart-plus fa-solid text-white fs-px-25',
			bgClass: 'bg-orange-v2'
		},

		{
			title: 'Tổng nhập',
			total: 0,
			prefix: '',
			url: '/warehouse/stock-in',
			key: 'total_income',
			icon: 'fa-arrow-trend-up fa-solid text-white fs-px-25',
			bgClass: 'bg-ABEFC6'
		},
		{
			title: 'Tổng xuất',
			total: 0,
			prefix: '',
			url: '/warehouse/stock-out',
			key: 'total_outcome',
			icon: 'fa-solid fa-arrow-trend-down text-white fs-px-25',
			bgClass: 'bg-orange'
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
			title: 'Người dùng',
			total: 0,
			prefix: '',
			url: '/account/user',
			key: 'total_user',
			icon: 'fa-circle-user fa-solid text-white fs-px-25',
			bgClass: 'bg-EFF8FF'
		},

		{
			title: 'Đơn hàng',
			total: 0,
			prefix: '',
			url: '/order',
			key: 'total_order',
			icon: 'fa-cart-plus fa-solid text-white fs-px-25',
			bgClass: 'bg-D9D6FE'
		},
		{
			title: 'Doanh thu',
			total: 0,
			prefix: ' đ',
			url: '/order',
			key: 'total_revenue',
			icon: 'fa-solid fa-credit-card text-white fs-px-25',
			bgClass: 'bg-ECFDF3'
		}

	]

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: DashboardService,
		private cdr: ChangeDetectorRef,
		private excelService: ExcelService

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
					if (this.listData) {
						this.listTotalData = this.listTotalData.map((item: any) => {
							item.total = Number(this.listData[`${item.key}`])
							return item;
						});
						let stock_ins = this.listData.stock_ins?.map((item: any) => {
							item.key = 'in';
							return item;
						});
						let stock_outs = this.listData.stock_outs?.map((item: any) => {
							item.key = 'out';
							return item;
						});

						let data = stock_ins.concat(stock_outs);
						this.listInOutProduct = data?.reduce((newItem: any, item: any) => {
							let stock_in = item?.key == 'in' ? Number(item.total_quantity) : 0;
							let stock_out = item?.key == 'out' ? Number(item.total_quantity) : 0;
							let obj = {
								product_id: item.product_id,
								product_name: item.name,
								product_quantity: item.number,
								stock_in: 0,
								total: 0,
								stock_out: 0,
							};
							let check = newItem.findIndex((e: any) => e?.product_id == obj?.product_id);
							if (check < 0) {
								obj.stock_in += stock_in;
								obj.stock_out += stock_out;
								obj.total = Number(obj.product_quantity) + Number(obj.stock_in) - Number(obj.stock_out);
								newItem.push(obj)
							} else {
								newItem[check].stock_in += stock_in;
								newItem[check].stock_out += stock_out;
								obj.total = Number(newItem[check].product_quantity) + Number(newItem[check].stock_in) - Number(newItem[check].stock_out);
							}
							return newItem;
						}, []);

						let year = moment().year();
						let month = moment().month() + 1;

						this.dataYears = Object.entries(this.listData?.order_month_in_year)?.reduce((newData: any, item: any) => {
							if (item?.length > 0) {
								let obj = {
									date: moment(`${year}-${item[0]}-01`).format('MMM'),
									value: item[1]
								}
								newData.push(obj);
							}
							return newData;
						}, []);
						this.dataMonths = Object.entries(this.listData?.order_day_in_month)?.reduce((newData: any, item: any) => {
							if (item?.length > 0) {
								let obj = {
									date: moment(`${year}-${month}-${item[0]}`).format('yyyy-MM-DD'),
									value: item[1]
								}
								newData.push(obj);
							}
							return newData;
						}, []);
					}
				} else {
					this.alertService.fireSmall('error', res?.message)
				}
			});


	}


	exportDataProduct = [
		
	];
	export(data: any, key = 'product') {
		let result = [];
		if(key == 'product') {
			result = data?.reduce((newResult: any, item: any) => {
				let obj = {
					'ID sản phẩm': item.product_id,
					'Tên sản phẩm': item.product_name,
					'Số lượng sản phẩm': item.product_quantity,
					'Tổng nhập': item.stock_in,
					'Tổng xuất': item.stock_out,
					'Tổng số lượng': item.total,
				};
				newResult.push(obj);
				return newResult;
			}, [])
		}
		this.excelService.exportToExcel(result, 'Nhập-Xuất-sản-phẩm')
	}
}
