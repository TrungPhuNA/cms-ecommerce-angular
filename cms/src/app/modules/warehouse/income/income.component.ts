import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AlertService, HelperService, ProductService, WarehouseService } from 'src/app/services';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, HomeBreadcrumb } from 'src/app/shared';
import { DEFAULT_IMG, STATUS_PRODUCTS } from 'src/app/shared/constants/common';
import { FormComponent } from '../form/form.component';
import { ActivatedRoute } from '@angular/router';


@Component({
	selector: 'app-income',
	templateUrl: './income.component.html',
	styleUrls: ['./income.component.scss'],
	host: { 'class': 'full-with-overflow-auto' }
})
export class IncomeComponent implements OnInit {

	loading: boolean = false;

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
	type: any;

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: WarehouseService,
		private cdr: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private dialog: MatDialog,

	) {

	}

	ngOnInit(): void {
		this.activatedRoute.params.subscribe((res => {
			console.log(res);
			this.type = res?.type || 'stock-in';
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb(this.type == 'stock-out' ? 'Xuất kho' : 'Nhập kho', '/warehouse/' + this.type),
				new Breadcrumb('Danh sách', ''),
			];
			this.search()

		}))
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
		this.service.getListData(params, this.type)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					let data = res?.data?.stockIns || [];
					if (this.type == 'stock-out') {
						data = res?.data?.stockOuts || []
					}

					this.listData = data?.map((item: any) => {
						item.warehouse_type = this.typeWareHouse.find((e: any) => e?.value == item.type)
						return item;
					}) || [];
					this.paging = this.helperService.buildPaging(res?.data?.meta);
				} else {
					this.alertService.fireSmall('error', res?.message)
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

	openModal(item?: any) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.width = '500px';
		dialogConfig.maxHeight = '95vh';
		dialogConfig.maxWidth = '95vw';
		dialogConfig.disableClose = true;
		dialogConfig.data = {
			item: item,
			type: this.type,
			title: item ? 'Cập nhật' : 'Tạo mới'
		};


		let dialogRef = this.dialog.open(FormComponent, dialogConfig);

		// action sau khi đóng modal
		dialogRef.afterClosed().subscribe((event: any) => {
			if (event?.success) {
				this.type = event?.type
				this.getListData();
			}
		});

	}
}

