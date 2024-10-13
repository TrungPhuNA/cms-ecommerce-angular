import { NgModule } from "@angular/core";
import { NumberCommaDirective } from "../directives/number-comma.directive";
import { InputNumberDirective } from "../directives/input-number.directive";

@NgModule({
    imports: [],
    declarations: [
        NumberCommaDirective,
		InputNumberDirective,
    ],
    providers: [],
    exports: [
        NumberCommaDirective,
		InputNumberDirective
    ],
})
export class DirectivesModule {
}
