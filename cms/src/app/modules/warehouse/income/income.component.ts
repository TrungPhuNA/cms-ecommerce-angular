import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AlertService, HelperService, ProductService } from 'src/app/services';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, HomeBreadcrumb } from 'src/app/shared';
import { DEFAULT_IMG, STATUS_PRODUCTS } from 'src/app/shared/constants/common';


@Component({
	selector: 'app-income',
	templateUrl: './income.component.html',
	styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {

	loading: boolean = false;

	paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};
	listData: any = [];

	defaultImg = DEFAULT_IMG;

	statuses = STATUS_PRODUCTS;


	searchForm: any = new FormGroup({
		name: new FormControl(null)
	});

	breadcrumbs: any;
	title = 'Danh sách';

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: ProductService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,

	) {
		this.breadcrumbs = [
			new HomeBreadcrumb(),
			new Breadcrumb('Sản phẩm', '/product'),
			new Breadcrumb('Danh sách', ''),
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
			...this.paging,
			...this.helperService.buildSearchValueByKeyFilter(this.searchForm.value)
		}
		this.service.getListData(params)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.listData = res?.data?.products?.map((item: any) => {
						let status = this.statuses.find((e: any) => e?.value == item?.status);
						item.status_name = status?.name;
						item.status_class = status?.class;
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

	deleteData(item: any) {
		this.alertService.fireConfirm('Bạn chắc chắn muốn xóa danh mục này chứ ?', '', 'warning', 'Hủy', 'Xóa')
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

