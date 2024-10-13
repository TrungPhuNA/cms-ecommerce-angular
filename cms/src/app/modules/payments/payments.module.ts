import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './index/index.component';
import {RouterModule, Routes} from "@angular/router";
import {FormMgsModule} from "../../shared/components/forms/form-Invalid-message.module";
import {ReactiveFormsModule} from "@angular/forms";
import {SpinnerModule} from "../../shared";
import {TranslateModule} from "@ngx-translate/core";

const routes: Routes = [
    {
        path: '',
        component: IndexComponent,
    },
]

@NgModule({
    declarations: [
        IndexComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormMgsModule,
        ReactiveFormsModule,
        SpinnerModule,
        TranslateModule,
    ]
})
export class PaymentsModule {
}
