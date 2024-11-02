import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
	providedIn: 'root'
})
export class ExcelService {

	constructor() { }

	public exportAsExcelFile(json: any[], excelFileName: string): void {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, excelFileName);
	}

	private saveAsExcelFile(buffer: any, fileName: string): void {
		var FileSaver = require('file-saver');
		const data: Blob = new Blob([buffer], {
			type: EXCEL_TYPE
		});
		FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
	}

	exportToExcel = (data: any[], fileName: string) => {
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
		const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
		const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
		this.saveAsExcelFile(excelBuffer, fileName);
	}

	downloadFile = (data: any, fileName: string) => {
		const blob = new Blob([data], { type: 'text/csv' });
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		link.click();
	}

	exportDataPdf = (input: any, name: any) => {
		html2canvas(input, { scale: 2 }).then((canvas) => {
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

			pdf.save(name + '.pdf');
		}).catch(e => {
			console.log(e);
		});
	}
}
