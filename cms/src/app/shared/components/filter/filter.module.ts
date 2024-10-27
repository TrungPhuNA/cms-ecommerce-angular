import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterComponent } from './filter.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
	declarations: [
		FilterComponent
	],
	imports: [
		ReactiveFormsModule,

		CommonModule
	],
	exports: [
		FilterComponent
	]
})
export class FilterModule { }
