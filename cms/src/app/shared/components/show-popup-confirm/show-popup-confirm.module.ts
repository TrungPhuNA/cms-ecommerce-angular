import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowPopupConfirmComponent } from './show-popup-confirm.component';
import { InlineSVGModule } from 'ng-inline-svg-2';



@NgModule({
	declarations: [ShowPopupConfirmComponent],
	imports: [
		CommonModule,
		InlineSVGModule
	],
	exports: [ShowPopupConfirmComponent]
})
export class ShowPopupConfirmModule { }
