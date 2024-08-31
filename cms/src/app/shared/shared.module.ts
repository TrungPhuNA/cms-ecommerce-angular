import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    AdvanceDatePickerModule,
    BaseComponent,
    SpinnerModule,
} from "./components";
import { FormMgsModule } from "./components/forms/form-Invalid-message.module";
import { ReactiveFormsModule } from "@angular/forms";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgOptionHighlightModule } from "@ng-select/ng-option-highlight";
import { MonthPickerModule } from "./components/month-picker/month-picker.module";
import { BaseSearchFormService } from "./data/baseSearchForm.service";
import { PipesModule } from './pipes/pipes.module';
import { DirectivesModule } from './modules/directives.module';
import { ShowPopupConfirmComponent } from './components/show-popup-confirm/show-popup-confirm.component';

@NgModule({
    declarations: [
        BaseComponent,
    ],
    imports: [
        CommonModule,
        PipesModule,
        SpinnerModule,
        FormMgsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgOptionHighlightModule,
        AdvanceDatePickerModule,
        MonthPickerModule,
        DirectivesModule,
    ],
    exports: [
	],
    providers: [
        BaseSearchFormService,
		
    ]
})
export class SharedModule {
}
