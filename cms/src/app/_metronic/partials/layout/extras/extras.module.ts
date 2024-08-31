import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {InlineSVGModule} from 'ng-inline-svg-2';
import {NgbTooltipModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [],
  imports: [CommonModule, FormsModule, InlineSVGModule, RouterModule, NgbTooltipModule],
  exports: [],
})
export class ExtrasModule {
}
