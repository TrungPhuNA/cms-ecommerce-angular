import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { IncomeComponent } from '../../income/income.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AlertService, HelperService } from 'src/app/services';
import moment from 'moment';
import { ExcelService } from 'src/app/services/common/excel.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
	selector: 'app-modal-pdf',
	templateUrl: './modal-pdf.component.html',
	styleUrls: ['./modal-pdf.component.scss']
})
export class ModalPdfComponent implements OnInit {

	data: any;
	title: any;
	type: any;
	time: any;

	total: any;

	listData: any
	constructor(
		private cdr: ChangeDetectorRef,
		private dialogRef: MatDialogRef<IncomeComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		public helperService: HelperService,
		private excelService: ExcelService
	) {
		this.data = data?.item;
		this.title = data?.title;
		this.type = data?.type;
		this.time = moment().locale('vi').format("[ngày] DD [Tháng] MM [Năm] YYYY")
	}

	ngOnInit(): void {
		this.genDataList()

	}

	onClose(status?: any) {
		this.dialogRef.close({
			success: status
		});
	}

	loading = false;
	exportPdf() {


		const exportDNTT: any = document.getElementById('exportDNTT');
		this.loading = true;
		html2canvas(exportDNTT, { scale: 2 }).then((canvas) => {
			const imgData: any = canvas.toDataURL('image/png');
			const pdf: any = new jsPDF('p', 'mm', 'a4');
			const imgProps: any = pdf.getImageProperties(imgData);
			const pdfWidth: any = pdf.internal.pageSize.getWidth();
			const pdfHeight: any = (imgProps.height * pdfWidth) / imgProps.width;

			// Set margin values
			const margin = 10; // Adjust this value as needed for left and right
			const bottomMargin = 20; // Adjust this value as needed for bottom margin
			const xPosition = margin; // Left margin
			const yPosition = 0; // Top margin

			// Add the first page
			pdf.addImage(imgData, 'PNG', xPosition, yPosition, pdfWidth - 2 * margin, pdfHeight);

			// Calculate the number of pages
			const totalPages = Math.ceil((pdfHeight + bottomMargin) / (pdf.internal.pageSize.getHeight() - bottomMargin));

			for (let i = 1; i < totalPages; i++) {
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', xPosition, -i * (pdf.internal.pageSize.getHeight() - bottomMargin) + yPosition, pdfWidth - 2 * margin, pdfHeight);
			}

			// Add bottom margin on the last page
			pdf.addPage();
			pdf.addImage(imgData, 'PNG', xPosition, -totalPages * (pdf.internal.pageSize.getHeight() - bottomMargin) + yPosition, pdfWidth - 2 * margin, pdfHeight);

			pdf.save(`${this.type}_${this.data.key}` + '.pdf');
			this.loading = false;
			this.cdr.detectChanges();
		}).catch(e => {
			console.log(e);
			this.loading = false;
			this.cdr.detectChanges();


		});
	}

	genDataList() {
		if (this.type == 'stock-in') {
			this.listData = [this.data]?.map((item: any) => {
				item.total_price = Number(item.price || 0) * Number(item.quantity || 0);

				return item;
			});
			this.total = this.listData?.reduce((newTotal: any, item: any) => {
				newTotal += Number(item.price || 0) * Number(item.quantity || 0);
				return newTotal;
			}, 0);
			console.log(this.listData);
		} else {
			this.listData = this.data?.stock_outs?.map((item: any) => {
				item.total_price = Number(item.price || 0) * Number(item.quantity || 0);
				return item;
			});
			this.total = this.data?.sub_total
		}

	}

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
	genWareHouseType(value: any) {
		return this.typeWareHouse.find((e: any) => e?.value == value)?.name
	}

}
