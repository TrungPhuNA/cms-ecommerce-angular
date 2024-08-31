import {NgModule} from "@angular/core";
import {OatPageTitleComponent} from "./oat-page-title.component";
import { NgClass, NgForOf, NgIf } from "@angular/common";
import { RouterLinkWithHref } from "@angular/router";

@NgModule({
  imports: [
    NgIf,
    RouterLinkWithHref,
    NgForOf,
    NgClass
  ],
  declarations: [OatPageTitleComponent],
  exports: [OatPageTitleComponent]
})
export class OatPageTitleModule {

}
