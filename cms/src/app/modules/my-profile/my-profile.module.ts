import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from 'src/app/shared';
import { ModalComponent } from './modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormMgsModule } from 'src/app/shared/components/forms/form-Invalid-message.module';

const routes: Routes = [
    {
        path: '',
        canActivate: [],
        children: [
            {
                path: '',
                component: IndexComponent
            },
        ],
    },
];

@NgModule({
    declarations: [IndexComponent, ModalComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        NgbPaginationModule,
        TranslateModule,
        SpinnerModule,
        MatDialogModule,
        FormMgsModule
    ],
    exports: [RouterModule]
})
export class MyProfileModule { }
