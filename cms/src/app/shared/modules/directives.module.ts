import { NgModule } from "@angular/core";
import { NumberCommaDirective } from "../directives/number-comma.directive";

@NgModule({
    imports: [],
    declarations: [
        NumberCommaDirective,
    ],
    providers: [],
    exports: [
        NumberCommaDirective,
    ],
})
export class DirectivesModule {
}
