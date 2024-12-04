import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OatPageTitleModule, PipesModule, SharedModule, SpinnerModule } from 'src/app/shared';
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
import { UploadModule } from 'src/app/shared/components/upload/upload.module';
import { FileSizeNoteModule } from 'src/app/shared/components/file-size-note/file-size-note.module';
import { NgxSummernoteModule } from 'ngx-summernote';
import { DirectivesModule } from 'src/app/shared/modules/directives.module';
import { OrderComponent } from './order/order.component';


const routes: Route[] = [
	{
		path: '',
		children: [
			
			{
				path: 'order/:id',
				component: OrderComponent
			}
		]
	}
]

@NgModule({
	declarations: [
		OrderComponent,
	],
	imports: [
		CommonModule,
		OatPageTitleModule,
		SharedModule,
		PaginationModule,
		PipesModule,
		RouterModule.forChild(routes),
		ReactiveFormsModule,
		NgSelectModule,
		MatDialogModule,
		FormMgsModule,
		DirectivesModule,
		MatMenuModule,
		TranslateModule,
		InlineSVGModule,
		SpinnerModule,
	]
})
export class QrCodeModule { }
