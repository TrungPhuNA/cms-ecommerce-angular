import { Component, Input, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { HelperService } from 'src/app/services';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    @Input() appHeaderDefaulMenuDisplay: boolean;
    @Input() isRtl: boolean;

    itemClass: string = 'ms-1 ms-lg-3';
    btnClass: string =
        'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
    userAvatarClass: string = 'symbol-35px symbol-md-40px';
    btnIconClass: string = 'svg-icon-1';

    user_info: any;
    avatar: any;

    constructor(private router: Router, private authService: AuthService,
		public helperService: HelperService
	) {
        let data: any = localStorage.getItem('user');
        if (!data) {
            this.authService.getMe().subscribe(res => {
                if (res?.status) {
                    this.user_info = res?.data;
                    this.avatar = this.user_info.avatar;
                    localStorage.setItem('user', JSON.stringify(this.user_info));
                }
            });
        } else {
            this.user_info = JSON.parse(data);
            this.avatar = this.user_info?.avatar;
        }

        this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
                data = localStorage.getItem('user');
                if (!data) {
                    this.authService.getMe().subscribe(res => {
                        if (res?.status) {
                            this.user_info = res?.data;
                            this.avatar = this.user_info.avatar;
                            localStorage.setItem('user', JSON.stringify(this.user_info));
                        }
                    });
                } else {
                    this.user_info = JSON.parse(data);
                    this.avatar = this.user_info?.avatar;
                }
			}
		});
    }

    ngOnInit(): void { }

    tracking(eventName: any) {
    }
}
