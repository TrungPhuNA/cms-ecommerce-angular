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
        title:'Quản lý yêu cầu',
        icon:'./assets/media/icons/home-line.svg',
        module_prefix: ['overview'],
        sub_menu: []
    },
    
];
