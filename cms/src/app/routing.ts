import { Routes } from '@angular/router';

const Routing: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    {
        path: 'overview',
        loadChildren: () => import('./modules/my-brief/my-brief.module').then((m) => m.MyBriefModule),
    },
    {
        path: 'my-profile',
        loadChildren: () => import('./modules/my-profile/my-profile.module').then((m) => m.MyProfileModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
