export interface ISideBarItem {
	path: string;
	title: string;
	icon?: string | any;
	class?: string;
	roles?: string[]
	_target?: boolean;
	module_prefix?: any; // để active menu được select và inactive các menu còn lại
	sub_menu?: ISideBarItem[]
}

export const SideBarItem: ISideBarItem[] = [
	{
		path: 'overview',
		roles: [ 'general_director', 'manage', 'administrator'],

		title: 'Overview',
		icon: 'fa-sharp-duotone fa-solid fa-chart-simple',
		module_prefix: ['overview'],
		sub_menu: []
	},
	{
		path: '',
		roles: ['staff', 'general_director', 'manage', 'administrator'],

		title: 'Tài khoản',
		icon: 'fa-solid fa-circle-user',
		module_prefix: ['account'],
		sub_menu: [
			{
				path: 'account/user',
				roles: ['staff', 'general_director', 'manage', 'administrator'],
				title: 'Người dùng',
				icon: 'fa-solid fa-user-large',
			},
			{
				path: 'account/setting/role',
				roles: ['staff', 'general_director', 'manage', 'administrator'],
				title: 'Role',
				icon: '',
			},
			{
				path: 'account/setting/permission',
				roles: ['staff', 'general_director', 'manage', 'administrator'],
				title: 'Permission',
				icon: '',
			}
		]
	},
	{
		path: 'category',
		roles: ['staff', 'general_director', 'manage', 'administrator'],
		title: 'Danh mục',
		icon: 'fa-sharp-duotone fa-solid fa-layer-group',
		module_prefix: ['category'],
		sub_menu: []
	},
	{
		path: 'product',
		roles: ['staff', 'general_director', 'manage', 'administrator'],
		title: 'Sản phẩm',
		icon: 'fa-sharp-duotone fa-solid fa-database',
		module_prefix: ['product'],
		sub_menu: []
	},
	{
		path: 'order',
		roles: ['staff', 'general_director', 'manage', 'administrator'],
		title: 'Đơn hàng',
		icon: 'fa-solid fa-cart-plus',
		module_prefix: ['order'],
		sub_menu: []
	},

	{
		path: 'supplier',
		roles: ['staff', 'general_director', 'manage', 'administrator'],

		title: 'Nhà cung cấp',
		icon: 'fa-solid fa-parachute-box',
		module_prefix: ['supplier'],
		sub_menu: []
	},

	{
		path: '',
		roles: ['staff', 'general_director', 'manage', 'administrator'],

		title: 'Kho',
		icon: 'fa-sharp-duotone fa-solid fa-house',
		module_prefix: ['warehouse'],
		sub_menu: [
			{
				path: 'warehouse-agency',
				roles: ['staff', 'general_director', 'manage', 'administrator'],
				title: 'Chi nhánh',
				icon: null,
			},
			{
				path: 'warehouse/stock-in',
				roles: ['staff', 'general_director', 'manage', 'administrator'],

				title: 'Nhập kho',
				icon: null,
			},
			{
				path: 'warehouse/stock-out',
				roles: ['staff', 'general_director', 'manage', 'administrator'],

				title: 'Xuất kho',
				icon: null,
			}
		]
	},
	// {
	//     path: '',
	// roles: ['staff', 'general_director', 'manage', 'administrator'],
	//     
	// title: 'Thanh toán',
	//     icon: 'fa fa-credit-card',
	//     module_prefix: ['payments'],
	//     sub_menu: [
	//         {
	//             path: 'payments',
	// roles: ['staff', 'general_director', 'manage', 'administrator'],
	//             
	// title: 'Cấu hình thanh toán',
	//             icon: null,
	//         }
	//     ]
	// },

];
