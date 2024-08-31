import {NgModule} from "@angular/core";
import {SpinnerComponent} from "./spinner.component";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgIf} from "@angular/common";

@NgModule({
  imports: [
    NgxSpinnerModule,
    NgIf
  ],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent]
})
export class SpinnerModule {
}
