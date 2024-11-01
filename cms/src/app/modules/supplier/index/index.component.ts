import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { AlertService, HelperService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { DEFAULT_IMG } from 'src/app/shared/constants/common';
import { FormComponent } from '../form/form.component';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, HomeBreadcrumb } from 'src/app/shared';
import { SupplierService } from 'src/app/services/supplier.service';

@Component({
	selector: 'app-index',
	templateUrl: './index.component.html',
	styleUrls: ['./index.component.scss'],
	host: { 'class': 'full-with-overflow-auto' }
	
})
export class IndexComponent implements OnInit {

	loading: boolean = false;
	title  = 'Danh sách';
	breadcrumbs: any;
	showFilter = false;


	paging: any = {
		page: 1,
		page_size: 20,
		total: 0
	};
	listData: any = [];

	defaultImg = DEFAULT_IMG;

	searchForm: any = new FormGroup({
		name: new FormControl(null)
	})
	constructor(
		private helperService: HelperService,
		private alertService: AlertService,
		private service: SupplierService,
		private cdr: ChangeDetectorRef,
		private dialog: MatDialog,

	) { }

	ngOnInit(): void {
		this.breadcrumbs = [
			new HomeBreadcrumb(),
			new Breadcrumb('Nhà cung cấp', '/supplier'),
			new Breadcrumb('Danh sách', ''),
		];
		this.search();
	}

	search() {
		this.paging.page = 1;
		this.getListData();
	}

	reset() {
		this.searchForm.reset();
		this.search();
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
					this.listData = res?.data?.suppliers || [];
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

	openModal(item?: any) {
		const dialogConfig = new MatDialogConfig();

		dialogConfig.width = '500px';
		dialogConfig.maxHeight = '95vh';
		dialogConfig.maxWidth = '95vw';
		dialogConfig.disableClose = true;
		dialogConfig.data = {
			item: item,
			title: item ? 'Cập nhật' : 'Tạo mới'
		};

		dialogConfig.panelClass = 'create-category'

		let dialogRef = this.dialog.open(FormComponent, dialogConfig);

		// action sau khi đóng modal
		dialogRef.afterClosed().subscribe((event: any) => {
			if (event?.success) {
				this.getListData();
			}
		});
	}

	deleteData(item: any) {
		this.alertService.fireConfirm('Bạn chắc chắn muốn xóa nhà cùng cấp này chứ ?', '', 'warning', 'Hủy', 'Xóa')
			.then((resAlert: any) => {
				if (resAlert?.isConfirmed) {
					this.loading = true;
					this.service.deleteData(item.id)
						.pipe((finalize(() => this.cdr.detectChanges())))
						.subscribe(res => {
							this.loading = false;
							if (res?.status == 'success') {
								this.alertService.fireSmall('success', ALERT_SUCCESS.create)
							} else {
								this.alertService.fireSmall('error', res?.message || ALERT_ERROR.delete)
							}
						})
				}
			})
	}

}
