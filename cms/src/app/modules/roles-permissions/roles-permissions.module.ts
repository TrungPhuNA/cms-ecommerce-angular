import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent as RoleIndex} from './role/index/index.component';
import { FormComponent as RoleForm} from './role/form/form.component';
import { FormComponent as PermissionForm } from './permission/form/form.component';
import { FormComponent as PermissionIndex } from './permission/form/form.component';
import { OatPageTitleModule, SharedModule } from 'src/app/shared';
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

const routes: Route[] = [
	{
		path: '',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'role/list'
			},
			{
				path: 'role',
				pathMatch: 'full',
				redirectTo: 'role/list'
			},
			{
				path: 'permission',
				pathMatch: 'full',
				redirectTo: 'permission/list'
			},
			{
				path: 'role/list',
				component: RoleIndex
			},
			{
				path: 'role/store',
				component: RoleForm
			},
			{
				path: 'role/edit/:id',
				component: RoleForm
			},
			{
				path: 'permission/list',
				component: PermissionIndex
			},
			{
				path: 'permission/edit/:id',
				component: PermissionForm
			},
			{
				path: 'permission/edit/:id',
				component: PermissionForm
			}
			
		]
	}
]; 

@NgModule({
  declarations: [
    RoleIndex,
    RoleForm,
	PermissionForm,
	PermissionIndex
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
	NgxSummernoteModule
  ]
})
export class RolesPermissionsModule { }
