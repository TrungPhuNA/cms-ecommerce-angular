import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { RouterModule, Routes } from '@angular/router';
import { OatPageTitleModule, PipesModule, SharedModule } from 'src/app/shared';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
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

const routes: Routes = [
	{
		path: '',
		component: DashboardComponent
	},
]

@NgModule({
	declarations: [
		DashboardComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		OatPageTitleModule,
		SharedModule,
		PaginationModule,
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
		PipesModule,
		FileSizeNoteModule,
		NgxSummernoteModule
	]
})
export class DashboardModule { }
