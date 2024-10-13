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
        path: 'warehouse',
        loadChildren: () => import('./modules/warehouse/warehouse.module').then((m) => m.WarehouseModule),
    },
	{
        path: 'order',
        loadChildren: () => import('./modules/orders/orders.module').then((m) => m.OrdersModule),
    },
	{
        path: 'account',
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'user'
			},
			{
				path: 'user',
				loadChildren: () => import('./modules/users/users.module').then((m) => m.UsersModule),
			},
			{
				path: 'setting',
				loadChildren: () => import('./modules/roles-permissions/roles-permissions.module').then((m) => m.RolesPermissionsModule),
			}
		]
    },
    {
        path: '**',
        redirectTo: 'error/404',
    },
];

export { Routing };
