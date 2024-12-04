import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, OrderService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { SupplierService } from 'src/app/services/supplier.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { ORDER_STATUSES, PAYMENT_STATUSES, STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {

	data: any;
	id: any;
	loading = false;

	agency: any;

	statuses = ORDER_STATUSES;
	paymentStatuses = PAYMENT_STATUSES;


	

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: OrderService,
		private productService: ProductService,
		private userService: AccountService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private supplierService: SupplierService,
		private router: Router,
		private uploadService: FileUploadService

	) {


	}
	ngOnInit(): void {
		this.activeRoute.params.subscribe((res: any) => {
			if (res?.id) {
				this.getDetail(res?.id);
			}
		});
	}

	

	

	getDetail(id: any) {
		this.loading = true;
		this.service.showData(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.data = res?.data?.order;
					if(this.data?.stock_outs?.length > 0 ) {
						this.agency = this.data?.stock_outs?.find((item: any) => item?.agency)?.agency;
					}
					if (!this.data) {
						this.alertService.fireSmall("error", ALERT_ERROR.not_found);
					}

				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.not_found)
				}
			})
	}


}

