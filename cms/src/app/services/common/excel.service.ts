// import { Injectable } from '@angular/core';
// import * as XLSX from 'xlsx';
// import { saveAs } from 'file-saver';

// const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
// const EXCEL_EXTENSION = '.xlsx';

// @Injectable({
//     providedIn: 'root'
// })
// export class ExcelService {

//     constructor() { }

//     public exportAsExcelFile(json: any[], excelFileName: string): void {
//         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
//         const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
//         const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//         this.saveAsExcelFile(excelBuffer, excelFileName);
//     }

//     private saveAsExcelFile(buffer: any, fileName: string): void {
//         var FileSaver = require('file-saver');
//         const data: Blob = new Blob([buffer], {
//             type: EXCEL_TYPE
//         });
//         FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
//     }

//     exportFileCsv(data: any, name?: any, id?: any) {
//         const replacer = (key: any, value: any) => value === null ? '' : value;
//         const header = Object.keys(data[0]);
//         let csv = data.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
//         csv.unshift(header.join(','));
//         let csvArray = csv.join('\r\n');

//         var blob = new Blob([csvArray], { type: 'text/csv' })
//         saveAs(blob, `${name}${new Date().getTime()}${id ? `_${id}` : ''}.csv`);
//     }

// }
