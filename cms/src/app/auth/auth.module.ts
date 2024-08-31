import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { AuthComponent } from './auth.component';
import { TranslateModule } from '@ngx-translate/core';
import { RegisterComponent } from './components/register/register.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { ActiveAccountComponent } from './components/active-account/active-account.component';
import { SpinnerModule } from '../shared';
import {RecaptchaModule} from 'ng-recaptcha';
import { FormMgsModule } from '../shared/components/forms/form-Invalid-message.module';
import { SwitchAccountComponent } from './components/switch-account/switch-account.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterPubComponent } from './components/register-pub/register-pub.component';

@NgModule({
    declarations: [
        LoginComponent,
        LogoutComponent,
        AuthComponent,
        RegisterComponent,
        ActiveAccountComponent,
        SwitchAccountComponent,
        ResetPasswordComponent,
        ForgotPasswordComponent,
        RegisterPubComponent,
    ],
	schemas: [
		CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA
	],
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        TranslateModule,
        NgSelectModule,
        InlineSVGModule,
		FormMgsModule,
        SpinnerModule,
		RecaptchaModule
    ],
})
export class AuthModule { }
