import {NgModule} from "@angular/core";
import {AdvanceDatePickerComponent} from "./advance-date-picker.component";
import {FormsModule} from "@angular/forms";
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {LocalizationService} from "../../../services";
import {NgClass} from "@angular/common";

@NgModule({
  declarations: [AdvanceDatePickerComponent],
    imports: [
        FormsModule,
        NgxDaterangepickerMd,
        NgClass
    ],
  providers: [
    LocalizationService
  ],
  exports: [AdvanceDatePickerComponent]
} )
export class AdvanceDatePickerModule {

}
