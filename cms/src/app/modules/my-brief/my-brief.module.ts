import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NgbPaginationModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateBriefComponent } from './create-brief/create-brief.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { DetailBriefComponent } from './detail-brief/detail-brief.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { MatMenuModule } from '@angular/material/menu';
import { SpinnerModule } from "../../shared/components/spinner/spinner.module";
import { ModalComponent } from './modal/modal.component';
import { FormMgsModule } from 'src/app/shared/components/forms/form-Invalid-message.module';
import { AdvanceDatePickerModule, SharedModule, ShowPopupConfirmModule } from 'src/app/shared';
import { FormBriefComponent } from './components/form-brief/form-brief.component';
import { DetailComponent } from './components/detail/detail.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [],
        children: [
            {
                path: '',
                component: IndexComponent
            },
            {
                path: 'brief/:id',
                component: DetailBriefComponent
            }
        ],
    },
];

@NgModule({
    declarations: [IndexComponent, CreateBriefComponent, DetailBriefComponent, ModalComponent, FormBriefComponent, DetailComponent],
    imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbPaginationModule,
    MatDialogModule,
	FormMgsModule,
	MatMenuModule,
	ShowPopupConfirmModule,
    TranslateModule,
    InlineSVGModule,
    SpinnerModule,
    NgbTooltipModule,
	AdvanceDatePickerModule,
],
    exports: [RouterModule]
})
export class MyBriefModule { }
