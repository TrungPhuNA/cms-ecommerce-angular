import { Routes } from '@angular/router';

const Routing: Routes = [
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
    {
        path: 'overview',
        loadChildren: () => import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
    },

	{
        path: 'category',
        loadChildren: () => import('./modules/category/category.module').then((m) => m.CategoryModule),
    },
	{
        path: 'product',
        loadChildren: () => import('./modules/product/product.module').then((m) => m.ProductModule),
    },
	{
        path: 'profile',
        loadChildren: () => import('./modules/profile/profile.module').then((m) => m.ProfileModule),
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
