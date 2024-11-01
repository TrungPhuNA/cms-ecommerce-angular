import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IndexComponent } from '../index/index.component';
import { AlertService, HelperService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { ALERT_SUCCESS } from 'src/app/shared';
import { SupplierService } from 'src/app/services/supplier.service';

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

	form = new FormGroup({
		name: new FormControl(null)
	});
	data: any;
	loading = false;
	submitted = false;

	@ViewChild('filter') filterCpn: ElementRef
	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<IndexComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		public helperService: HelperService,
		private service: SupplierService
	) {
		this.data = data?.item;
		this.title = data?.title;
		if(this.data) {
			this.form.patchValue(this.data);
		}
	}

	ngOnInit(): void {

	}
	ngOnChanges(): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
	}

	onClose(status?: any) {
		this.form.reset();
		this.dialogRef.close({
			success: status
		});
	}
	ngAfterViewInit(): void {
		//Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
		//Add 'implements AfterViewInit' to the class.
		
	}

	submit() {
		this.loading = true;
		this.submitted = true;
		this.service.createOrUpdateData(this.form.value, this.data?.id)
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
