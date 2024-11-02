import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { IncomeComponent } from '../../income/income.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, HelperService } from 'src/app/services';
import moment from 'moment';

@Component({
	selector: 'app-modal-pdf',
	templateUrl: './modal-pdf.component.html',
	styleUrls: ['./modal-pdf.component.scss']
})
export class ModalPdfComponent implements OnInit {

	data: any;
	title: any;
	time: any;
	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<IncomeComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		public helperService: HelperService,
	) {
		this.data = data?.item;
		this.title = data?.title;
		this.time = moment(data?.item?.created_at).locale('vi').format("[ngày] DD [Tháng] MM [Năm] YYYY")
	}

	ngOnInit(): void {

	}

	onClose(status?: any) {
		this.dialogRef.close({
			success: status
		});
	}

	exportPdf() {

	}

}
