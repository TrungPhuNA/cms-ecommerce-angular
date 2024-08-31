import {NgModule} from "@angular/core";
import {DateRangePickerComponent} from "./date-range-picker.component";
import {JsonPipe} from "@angular/common";
import {NgbDatepickerModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [DateRangePickerComponent],
  imports: [
    JsonPipe,
    NgbDatepickerModule
  ],
  exports: [DateRangePickerComponent]
})

export class DateRangePickerModule {
}
