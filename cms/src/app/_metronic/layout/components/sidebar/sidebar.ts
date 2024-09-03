export interface ISideBarItem {
    path: string;
    title: string;
    icon?: string;
    class?: string;
	_target?: boolean;
    module_prefix?: any; // để active menu được select và inactive các menu còn lại
    sub_menu?: ISideBarItem[]
}

export const SideBarItem: ISideBarItem[] = [
    {
        path: 'overview',
        title:'Overview',
        icon:'fa-sharp-duotone fa-solid fa-chart-simple',
        module_prefix: ['overview'],
        sub_menu: []
    },
	{
        path: 'category',
        title:'Danh mục',
        icon:'fa-sharp-duotone fa-solid fa-layer-group',
        module_prefix: ['category'],
        sub_menu: []
    },
	{
        path: 'product',
        title:'Sản phẩm',
        icon:'fa-sharp-duotone fa-solid fa-list',
        module_prefix: ['product'],
        sub_menu: []
    },
	{
        path: 'warehouse',
        title:'Kho',
        icon:'fa-sharp-duotone fa-solid fa-house',
        module_prefix: ['warehouse'],
        sub_menu: []
    },
    
];
