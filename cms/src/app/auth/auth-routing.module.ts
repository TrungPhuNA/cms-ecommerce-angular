import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { ActiveAccountComponent } from './components/active-account/active-account.component';
import { LoginGuard } from './login.guard';
import { SwitchAccountComponent } from './components/switch-account/switch-account.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RegisterPubComponent } from './components/register-pub/register-pub.component';

const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full',
            },
            {
                path: 'login',
                component: LoginComponent,
                canActivate: [LoginGuard]
            },
            {
                path: 'register',
                component: RegisterComponent,
            },
            {
                path: 'update-user-information',
                component: RegisterPubComponent,
            },
            {
                path: 'active-account/:token',
                component: ActiveAccountComponent,
            },
            {
                path: 'logout',
                component: LogoutComponent,
            },
			{
                path: 'switch-account',
                component: SwitchAccountComponent,
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent,
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            { path: '**', redirectTo: 'login', pathMatch: 'full' },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }
