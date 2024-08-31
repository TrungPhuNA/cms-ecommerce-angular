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
        icon:'./assets/media/icons/home-line.svg',
        module_prefix: ['overview'],
        sub_menu: []
    },
	{
        path: 'category',
        title:'Danh mục',
        icon:'./assets/media/icons/my-brief.svg',
        module_prefix: ['category'],
        sub_menu: []
    },
    
];
