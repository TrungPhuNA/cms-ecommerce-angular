export interface ISideBarItem {
	path: string;
	title: string;
	icon?: string|any;
	class?: string;
	_target?: boolean;
	module_prefix?: any; // để active menu được select và inactive các menu còn lại
	sub_menu?: ISideBarItem[]
}

export const SideBarItem: ISideBarItem[] = [
	{
		path: 'overview',
		title: 'Overview',
		icon: 'fa-sharp-duotone fa-solid fa-chart-simple',
		module_prefix: ['overview'],
		sub_menu: []
	},
	{
		path: '',
		title: 'Tài khoản',
		icon: 'fa-solid fa-circle-user',
		module_prefix: ['account'],
		sub_menu: [
			{
				path: 'account/user',
				title: 'Người dùng',
				icon: 'fa-solid fa-user-large',
			},
			{
				path: 'account/setting/role',
				title: 'Role',
				icon: '',
			},
			{
				path: 'account/setting/permission',
				title: 'Permission',
				icon: '',
			}
		]
	},
	{
		path: 'category',
		title: 'Danh mục',
		icon: 'fa-sharp-duotone fa-solid fa-layer-group',
		module_prefix: ['category'],
		sub_menu: []
	},
	{
		path: 'product',
		title: 'Sản phẩm',
		icon: 'fa-sharp-duotone fa-solid fa-database',
		module_prefix: ['product'],
		sub_menu: []
	},
	{
		path: 'order',
		title: 'Đơn hàng',
		icon: 'fa-solid fa-cart-plus',
		module_prefix: ['order'],
		sub_menu: []
	},

	{
		path: '',
		title: 'Kho',
		icon: 'fa-sharp-duotone fa-solid fa-house',
		module_prefix: ['warehouse'],
		sub_menu: [
			{
				path: 'warehouse/stock-in',
				title: 'Nhập kho',
				icon: null,
			},
			{
				path: 'warehouse/stock-out',
				title: 'Xuất kho',
				icon: null,
			}
		]
	},
    {
        path: '',
        title: 'Thanh toán',
        icon: 'fa fa-credit-card',
        module_prefix: ['payments'],
        sub_menu: [
            {
                path: 'payments',
                title: 'Cấu hình thanh toán',
                icon: null,
            }
        ]
    },

];
