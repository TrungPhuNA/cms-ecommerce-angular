import {NgModule} from "@angular/core";
import {FormInvalidMessageComponent} from "./form-invalid-message.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@NgModule({
  imports: [ReactiveFormsModule, FormsModule, NgIf],
  declarations: [FormInvalidMessageComponent],
  exports: [FormInvalidMessageComponent]
})
export class FormMgsModule {
}
