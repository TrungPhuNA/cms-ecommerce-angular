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
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';

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
			// {
			// 	path: 'outcome',
			// 	component: OutcomeComponent
			// },
		]
	}
]

@NgModule({
	declarations: [
		IndexComponent,
		FormComponent
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
		PipesModule
	]
})
export class AgencyModule { }
