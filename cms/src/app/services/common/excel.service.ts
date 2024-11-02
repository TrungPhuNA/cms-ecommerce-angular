import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

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
}
