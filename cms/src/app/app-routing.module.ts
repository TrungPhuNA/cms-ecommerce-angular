import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
	{
        path: 'qr-code',
        loadChildren: () =>
            import('./qr-code/qr-code.module').then((m) => m.QrCodeModule),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('./shared/errors/errors.module').then((m) => m.ErrorsModule),
    },
    {
        path: '',
        canActivate: [AuthGuard],
        loadChildren: () =>
            import('./_metronic/layout/layout.module').then((m) => m.LayoutModule),
    },
    { path: '**', redirectTo: 'error/404' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
