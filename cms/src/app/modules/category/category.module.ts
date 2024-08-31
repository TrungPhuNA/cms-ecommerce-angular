import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index/index.component';
import { FormComponent } from './form/form.component';
import { SharedModule } from 'src/app/shared';
import { PaginationModule } from 'src/app/shared/components/pagination/pagination.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
	{
		path: '',
		redirectTo: 'list',
		pathMatch: 'full'
	},
	{
		path: 'list',
		component: IndexComponent,
	},
]

@NgModule({
	declarations: [
		IndexComponent,
		FormComponent
	],
	imports: [
		CommonModule,
		SharedModule,
		PaginationModule,
		RouterModule.forChild(routes),
		
	]
})
export class CategoryModule { }
