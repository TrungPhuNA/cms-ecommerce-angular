import {NgModule} from "@angular/core";
import {NgClass} from "@angular/common";
import {MonthPickerComponent} from "./month-picker.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [MonthPickerComponent],
  imports: [
    NgClass,
    NgSelectModule,
    FormsModule
  ],
  providers: [],
  exports: [MonthPickerComponent]
})
export class MonthPickerModule {

}
