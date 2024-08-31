import { Component, Input } from '@angular/core';
import { Breadcrumb } from "./oat-page-title.model";

@Component( {
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'oat-page-title',
  templateUrl: './oat-page-title.component.html',
  styleUrls: ['./oat-page-title.component.scss']
} )
export class OatPageTitleComponent {

  constructor() {
  }

  @Input() title: string;
  @Input() breadcrumb: Breadcrumb[];
  @Input() separator: string = '»';
}
