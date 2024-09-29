import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService, UserType } from "../../../../../../services/auth.service";
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-user-inner',
    templateUrl: './user-inner.component.html',
})
export class UserInnerComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    class = `menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px`;
    @HostBinding('attr.data-kt-menu') dataKtMenu = 'true';

    language: LanguageFlag;
    userInfo: any;
    langs = languages;
    private unsubscribe: Subscription[] = [];

    constructor(
        private authService: AuthService,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef,
        private router: Router,
    ) {
        let data: any = localStorage.getItem('user');

        if (!data) {
            this.authService.getMe().subscribe(res => {
                if (res?.status) {
                    this.userInfo = res?.data;
                    localStorage.setItem('user', JSON.stringify(this.userInfo));
                }
            });
        } else this.userInfo = JSON.parse(data);
		console.log(this.userInfo);

        // this.router.events.subscribe((event) => {
		// 	if (event instanceof NavigationEnd) {
        //         data = localStorage.getItem('user');
        //         if (!data) {
        //             this.authService.getMe().subscribe(res => {
        //                 if (res?.status) {
        //                     this.userInfo = res?.data;
        //                     localStorage.setItem('user', JSON.stringify(this.userInfo));
        //                 }
        //             });
        //         } else this.userInfo = JSON.parse(data);
		// 	}
		// });
    }

    ngOnInit(): void {
        const lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'vi';
        if (lang) {
            this.setLanguage(lang);
        } else {
            this.setLanguage('vi');
        }
    }

    logout() {
        this.authService.logout();
		this.authService.logoutWithoutCache();
		window.location.href = '/'
    }

    selectLanguage(lang: string) {
        localStorage.setItem('language', lang);
        this.translateService.use(lang);
        this.setLanguage(lang);
        // document.location.reload();
    }

    setLanguage(lang: string) {
        this.langs.forEach((language: LanguageFlag) => {
            if (language.lang === lang) {
                language.active = true;
                this.language = language;
            } else {
                language.active = false;
            }
            this.translateService.use(lang);
        });
    }

    ngOnDestroy() {
        this.unsubscribe.forEach((sb) => sb.unsubscribe());
    }

    tracking(eventName: any) {
    }
}

interface LanguageFlag {
    lang: string;
    name: string;
    flag: string;
    active?: boolean;
}

const languages = [
    // {
    //     lang: 'en',
    //     name: 'English',
    //     flag: './assets/media/flags/united-states.svg',
    // },
    {
        lang: 'vi',
        name: 'Vietnamese',
        flag: './assets/media/flags/vietnam.svg',
    }
];
