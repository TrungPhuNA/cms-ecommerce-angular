import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ISideBarItem, SideBarItem } from '../sidebar';
import { Router } from '@angular/router';

@Component({
    selector: 'app-sidebar-menu',
    templateUrl: './sidebar-menu.component.html',
    styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {

    @Input() toggleButtonClass: string = '';
    @Input() toggleEnabled: boolean;
    @Input() toggleState: string = '';
    @Input() toggleType: string = '';
	
    toggleAttr: any;

    sideBarNavItem: ISideBarItem[];

    arrowLeft: boolean = false;

    userInfo: any;

    constructor(
        private router: Router,
    ) {
        const user_info: any = localStorage.getItem('user');
        this.userInfo = JSON.parse(user_info);
    }

    ngOnInit(): void {
        this.toggleAttr = `app-sidebar-${this.toggleType}`;
        
        this.getListAside();
    }

    getListAside() {
        this.sideBarNavItem = SideBarItem.filter((sidebarnavItem: ISideBarItem) => sidebarnavItem);
    }


    activeModule(prefix: any) {
        let flag = false;
        prefix.forEach((item: string) => {
            if (this.router.url.includes(item)) flag = true;
        });
        return flag;
    }

    @ViewChild('isActive') elRef: ElementRef; 
    isActiveClass() {
        let class_list: any = Array.from(this.elRef.nativeElement.classList);
        if (!class_list.find((item: any) => item === 'active')) this.arrowLeft = true;
        else this.arrowLeft = false;
    }

    tracking(e: any) {
    }
}
