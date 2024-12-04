import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountService, AlertService, HelperService, ProductService, WarehouseService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ALERT_SUCCESS } from 'src/app/shared';
import { PERMISSION_GROUPS } from 'src/app/shared/constants/permission';
import { STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';
import moment from 'moment';
import { IndexComponent } from '../index/index.component';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss'],
	host: { 'class': 'full-with-overflow-auto' }
})
export class FormComponent implements OnInit {

	icon: any;
	title: any;
	content: any;
	clickSelect = false;

	statuses = STATUS_PRODUCTS

	form = new FormGroup({
		name: new FormControl(null, Validators.required),
		description: new FormControl(null, Validators.required),
		status: new FormControl(null, Validators.required),
	});

	data: any;
	loading = false;
	submitted = false;

	listGroup = PERMISSION_GROUPS;

	validatorMessages = VALIDATOR_MESSAGES;

	dataType: any;
	

	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<IndexComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		public helperService: HelperService,
		private service: WarehouseService
	) {
		this.data = data?.item;
		this.title = data?.title;
		if(this.data) {
			this.form.patchValue(this.data);
		}
	}

	userInfo: any;
	ngOnInit(): void {
		let data: any = localStorage.getItem('user');
		if(data) {
			this.userInfo = JSON.parse(data);
		}
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
		if(this.form.invalid) {
			return;
		}
		let dataForm: any = {
			...this.form.value,
		}
		if(!this.data) {
			dataForm.user_id = this.userInfo?.id;
			dataForm.date = moment().format('yyyy-MM-DD');
		}
		this.loading = true;
		this.service.createOrUpdateData(dataForm, this.data?.id, "agency")
		.pipe(finalize(() => this.cdr.detectChanges()))
		.subscribe((res:any) => {
			this.loading = false;
			if(res?.status == 'success') {
				this.submitted = false;
				this.alertService.fireSmall('success', this.data?.id ? ALERT_SUCCESS.update : ALERT_SUCCESS.create);
				this.onClose(true)
			} else {
				this.alertService.fireSmall('error', res?.message || (this.data?.id ? ALERT_SUCCESS.update : ALERT_SUCCESS.create));
			}
		})
	}

}
