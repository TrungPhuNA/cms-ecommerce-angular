import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form/form.component';
import { IndexComponent } from './index/index.component';
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
import { DirectivesModule } from 'src/app/shared/modules/directives.module';

const routes: Route[] = [
	{
		path: '',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'list'
			},
			{
				path: 'list',
				component: IndexComponent
			},
			{
				path: 'store',
				component: FormComponent
			},
			{
				path: 'edit/:id',
				component: FormComponent
			}
			
		]
	}
]

@NgModule({
	declarations: [
		FormComponent,
		IndexComponent
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
		DirectivesModule,
		MatMenuModule,
		TranslateModule,
		InlineSVGModule,
		SpinnerModule,
		PipesModule,
		UploadModule,
		FileSizeNoteModule,
		NgxSummernoteModule
	]
})
export class ProductModule { }
