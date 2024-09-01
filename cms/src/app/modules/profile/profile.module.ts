import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { SpinnerModule } from 'src/app/shared';
import { MatDialogModule } from '@angular/material/dialog';
import { FormMgsModule } from 'src/app/shared/components/forms/form-Invalid-message.module';


const routes: Routes = [
	{
		path: '',
		component: ProfileComponent,
	},
]
@NgModule({
	declarations: [
		ProfileComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		CommonModule,
        RouterModule.forChild(routes),
        ReactiveFormsModule,
        NgSelectModule,
        TranslateModule,
        SpinnerModule,
        MatDialogModule,
        FormMgsModule
	]
})
export class ProfileModule { }
