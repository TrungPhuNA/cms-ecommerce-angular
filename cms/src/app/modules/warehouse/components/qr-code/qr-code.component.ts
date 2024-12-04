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
import { NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';

@Component({
	selector: 'app-qr-code',
	templateUrl: './qr-code.component.html',
	styleUrls: ['./qr-code.component.scss']
})
export class QrCodeComponent implements OnInit {
	icon: any;
	title: any;

	data: any;
	loading = false;

	elementType: any = 'url';
	value = '123123123123';

	errorCorrectionLevel = NgxQrcodeErrorCorrectionLevels.MEDIUM;


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
		if (this.data) {
			this.title = this.data?.code;
			this.value = window.location.origin + `/qr-code/order/${this.data?.id}`
		}
	}

	ngOnInit(): void {
	}

	onClose(status?: any) {

		this.dialogRef.close({
			success: status,
		});
	}

}
