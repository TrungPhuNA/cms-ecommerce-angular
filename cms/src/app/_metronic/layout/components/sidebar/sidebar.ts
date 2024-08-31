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
    {
        path: 'https://solutions.accesstrade.vn/?utm_source=brandsite',
        title:'Discovery',
        icon:'./assets/media/icons/discovery.svg',
        module_prefix: ['discovery'],
		_target: true,
        sub_menu: []
    },
];
