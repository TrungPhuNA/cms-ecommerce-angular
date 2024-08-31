import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateBriefComponent } from '../create-brief/create-brief.component';
import { AuthService } from 'src/app/services/auth.service';
import { ConfigService } from 'src/app/services/config.service';
import { BriefService } from 'src/app/services/brief.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, Subject, tap } from 'rxjs';
import { NEWS_CONFIG } from 'src/app/shared/constants/news';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
    host: {
        "(window:resize)":"onWindowResize($event)"
    }
})
export class IndexComponent implements OnInit {

    @ViewChild('scroll_target') scroll_target: ElementRef<HTMLElement>;

    loading: boolean = false;

    userInfo: any;
    username: any;

    paging: any = {
        page: 1,
        page_size: 20,
        total: 0
    };

    summary: any;
    briefs: any = [];

    configs: any = this.configService.getSetting();
	//{...CRM_CONFIG_DEFAULT};
    statusConfig: any = [
        { name: 'Chờ tiếp nhận', value: 1 },
        { name: 'Bị từ chối', value: 2 },
        { name: 'Chờ gửi lại đề xuất', value: 3 },
        { name: 'Cần phê duyệt', value: 4 },
        { name: 'Đã từ chối', value: 5 },
        { name: 'Đang thực hiện', value: 6 },
        { name: 'Tạm dừng', value: 7 },
        { name: 'Đã hoàn thành', value: 8 },
    ];

    searchForm: any = new FormGroup({
        'filters[name]': new FormControl(null),
        'filters[status]': new FormControl(null)
    });

    keyBrief = new Subject<string>();

    isFilterStatus: boolean = false;

    slides: any = [...NEWS_CONFIG];
    groupedSlides: any = [];
    currentSlide: number = 0;

    constructor(
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private configService: ConfigService,
        private briefService: BriefService,
        private authService: AuthService,
        private gaService: GoogleAnalyticsService
    ) {
        this.activatedRoute.queryParams.subscribe((res: any) => {
            if (res) {
                this.isFilterStatus = res.status ? true : false;
                this.searchForm.patchValue({ 'filters[status]': res.status ? Number(res.status) : null });
                this.listBrief();
                this.scroll_target?.nativeElement.scrollIntoView({ behavior: "smooth", block: "start" });

                if (res.popup_create == 'opened') this.openModal();
            }
        });
    }

    ngOnInit(): void {
        const user_info: any = localStorage.getItem('user_crm_info');
        this.userInfo = JSON.parse(user_info);
        this.username = this.userInfo.username;
        this.tracking('adv_access_home_page');
		this.getMe();
        this.summaryBrief();
        this.listBrief();
        this.searchBriefByName();

        this.width = window.innerWidth;
        if (this.width >= 1200) this.groupSlides(3);
        else if (this.width >= 576) this.groupSlides(2);
        else this.groupSlides(1);


    }

	getMe() {
		this.authService.getMe().subscribe((res: any) => {
			if(res?.status == 'success') {
				this.userInfo = {...this.userInfo, ...res?.data};
				if(!res?.data?.number_of_access || res?.data?.number_of_access <= 1) {
					this.openModal();
				}
			} else if(!this.userInfo?.number_of_access || res?.data?.number_of_access <= 1) {
				this.openModal();
			}
			this.cdr.detectChanges();
		})
	}
    summaryBrief() {
        this.briefService.getSumaryBrief().subscribe(res => {
            this.summary = res?.data?.status;
            this.cdr.detectChanges();
        });
    }

    listBrief(loading?: boolean) {
        this.loading = loading == false ? loading : true;
        this.briefService.getBriefs({ page: this.paging.page, page_size: this.paging.page_size, ...this.searchForm.value }).subscribe(res => {
            if (res.status == 'success') {
                this.briefs = res.data?.briefs;
                this.paging.total = res.data?.meta?.total;
            }
            this.loading = false;
            this.cdr.detectChanges();
        }, error => {
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    changePage(e: any) {
        this.paging.page = e;
        this.listBrief();
    }

    openModal() {
        const dialogConfig = new MatDialogConfig();

        dialogConfig.width = '800px';
        dialogConfig.maxHeight = '95vh';
        dialogConfig.maxWidth = '95vw';
        dialogConfig.disableClose = true;
        dialogConfig.data = { configs: this.configs, user_info: this.userInfo };

		dialogConfig.panelClass = 'create-brief'

        let dialogRef = this.dialog.open(CreateBriefComponent, dialogConfig);

        // action sau khi đóng modal
        dialogRef.afterClosed().subscribe((event: any) => {
            if (event?.success) {
                this.listBrief();
                this.summaryBrief();
            }
        });
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    renderStatus(status: any) {
        if (status == 1) return { name: 'Chờ tiếp nhận', color: 'orange' };
        if (status == 2) return { name: 'Bị từ chối', color: 'danger' };
        if (status == 3) return { name: 'Chờ gửi lại đề xuất', color: 'orange' };
        if (status == 4) return { name: 'Cần phê duyệt', color: 'info' };
        if (status == 5) return { name: 'Đã từ chối', color: 'danger' };
        if (status == 6) return { name: 'Đang thực hiện', color: 'primary' };
        if (status == 7) return { name: 'Tạm dừng', color: 'danger' };
        if (status == 8) return { name: 'Đã hoàn thành', color: 'success' };
    }

    filterByStatus(status?: any, el?: HTMLElement) {
        if (this.searchForm.get('filters[status]').value === status) {
            this.searchForm.patchValue({ 'filters[status]': null });
            this.navigateToUrl({ status: null });
        } else {
            switch (status) {
                case 1:
                    this.tracking('adv_click_waiting_review_status');
                    break;
                case 2:
                    this.tracking('adv_click_be_denied_status');
                    break;
                case 3:
                    this.tracking('adv_click_waiting_proposal_status');
                    break;
                case 4:
                    this.tracking('adv_click_need_to_approve_status');
                    break;
                case 5:
                    this.tracking('adv_click_rejected_status');
                    break;
                case 6:
                    this.tracking('adv_click_doing_status');
                    break;
                case 7:
                    this.tracking('adv_click_paused_status');
                    break;
                case 8:
                    this.tracking('adv_click_done_status');
                    break;
                default:
                    break;
            }
            this.navigateToUrl({ status: status });
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    changeStatus(e: any) {
        if (e) {
            this.tracking('adv_filter_status');
            this.searchForm.patchValue({ 'filters[status]': e.value });
            this.navigateToUrl({ status: this.getControl('filters[status]') });
        } else {
            this.filterByStatus();
            this.navigateToUrl({ status: null });
        }
    }

    navigateToUrl(params: any) {
        this.router.navigate(['overview'], {
            queryParams: {
                status: params?.status || null
            }
        });
    }

    searchBriefByName() {
        this.keyBrief.pipe(
            map((event: string) => { return event })
            , debounceTime(1000)
            , distinctUntilChanged()
            , tap(() => { this.cdr.detectChanges() })
        ).subscribe((text: string) => {
            this.briefService.getBriefs({ page: 1, page_size: this.paging.page_size, ...this.searchForm.value, 'filters[name]': text }).subscribe((res: any) => {
                if(res.status === 'success') {
                    this.tracking('adv_search');
                    this.briefs = res.data?.briefs;
                    this.paging.total = res.data?.meta?.total;
                }
                this.cdr.detectChanges();
            });
        });
    }

    getControl(control: any) {
        return this.searchForm.get(`${control}`).value;
    }

    widthSlide: number;
    maxTransform: number;
    groupSlides(number: any = 3) {
        if (this.widthSlide != number) {
            this.widthSlide = number;
            if (number == 3) this.maxTransform = 1;
            if (number == 2) this.maxTransform = 4;
            this.currentSlide = 0;
            this.groupedSlides = [];
            for (let i = 0; i < this.slides.length; i += number) {
                this.groupedSlides.push(this.slides.slice(i, i + number));
            }
        }
    }
    
    nextSlide() {
        if (this.widthSlide == 1) {
            if (this.currentSlide < this.groupedSlides.length - 2) {
                this.currentSlide = (this.currentSlide + 1) % this.groupedSlides.length;
            }
        } else if (this.currentSlide < this.maxTransform) this.currentSlide++;
    }
    
    prevSlide() {
        if (this.widthSlide == 1) {
            if (this.currentSlide != 0) {
                this.currentSlide = (this.currentSlide - 1 + this.groupedSlides.length) % this.groupedSlides.length;
            }
        } else if (this.currentSlide != 0) this.currentSlide--;
    }

    goToSlide(index: number) {
        this.currentSlide = index;
    }

    width: number;
    onWindowResize(event: any) {
        this.width = event.target.innerWidth;
        if (this.width >= 1200) this.groupSlides(3);
        else if (this.width >= 576) this.groupSlides(2);
        else this.groupSlides(1);
    }

    viewMore() {
        window.open('https://accesstrade.vn/goc-bao-chi/?utm_source=crm_adv_site', '_blank');
    }

    tracking(eventName: any) {
        this.gaService.sendEvent(eventName, { username: this.username });
    }
}
