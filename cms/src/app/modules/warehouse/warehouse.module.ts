import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from './income/income.component';
import { OatPageTitleModule, PipesModule, SharedModule } from 'src/app/shared';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { Route, RouterModule, Routes } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { TranslateModule } from '@ngx-translate/core';
import { FormMgsModule } from 'src/app/shared/components/forms/form-Invalid-message.module';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';

import { MatMenuModule } from '@angular/material/menu';
import { SpinnerModule } from "../../shared/components/spinner/spinner.module";
import { UploadModule } from 'src/app/shared/components/upload/upload.module';
import { FileSizeNoteModule } from 'src/app/shared/components/file-size-note/file-size-note.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { FormComponent } from './form/form.component';
import { ModalPdfComponent } from './components/modal-pdf/modal-pdf.component';
import { FormStockOutComponent } from './components/form-stock-out/form-stock-out.component';
import { QrCodeComponent } from './components/qr-code/qr-code.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

const routes: Route[] = [
	{
		path: '',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'stock-in'
			},
			{
				path: ':type',
				component: IncomeComponent
			},
			// {
			// 	path: 'outcome',
			// 	component: OutcomeComponent
			// },
		]
	}
]


@NgModule({
	declarations: [
		IncomeComponent,
		FormComponent,
		ModalPdfComponent,
		FormStockOutComponent,
		QrCodeComponent,
	],
	imports: [
		CommonModule,
		OatPageTitleModule,
		SharedModule,
		PaginationModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		NgSelectModule,
		NgbPaginationModule,
		MatDialogModule,
		FormMgsModule,
		MatMenuModule,
		TranslateModule,
		InlineSVGModule,
		SpinnerModule,
		UploadModule,
		FileSizeNoteModule,
		PipesModule,
		NgxSummernoteModule,
		NgxQRCodeModule
	]
})
export class WarehouseModule { }
