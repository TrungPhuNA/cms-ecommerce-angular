import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService } from 'src/app/services';
import { BriefService } from 'src/app/services/brief.service';
import { isObject } from 'lodash';
import { DetailComponent } from 'src/app/modules/my-brief/components/detail/detail.component';
import { DetailBriefComponent } from 'src/app/modules/my-brief/detail-brief/detail-brief.component';
interface IConfigModal {
	showCancel?: boolean|null| undefined,
	confirmText?: string|null| undefined,
	cancelText?: string|null| undefined,
	classContent?: string|null| undefined,
	classTitle?: string|null| undefined,
}
@Component({
	selector: 'app-show-popup-confirm',
	templateUrl: './show-popup-confirm.component.html',
	styleUrls: ['./show-popup-confirm.component.scss']
})
export class ShowPopupConfirmComponent implements OnInit {

	icon: any;
	title: any;
	content: any;

	config: IConfigModal;

	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<DetailBriefComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		private briefService: BriefService
	) {
		this.icon = data?.icon;
		this.title = data?.title;
		this.content = data?.content;
		this.config = data?.config;
	}

	ngOnInit(): void {

	}

	onClose(data?: any) {
		this.dialogRef.close({
			confirmed: data == 1
		});
	}

	submit() {
		this.dialogRef.close({
			confirmed: true
		});
	}

	

}
