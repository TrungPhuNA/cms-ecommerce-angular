import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {finalize} from "rxjs";
import {PaymentService} from "../../../services/payment.service";
import {HelperService} from "../../../services";

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
    loading: boolean = false;

    paging: any = {
        page: 1,
        page_size: 20,
        total: 0
    };
    listData: any = [];

    constructor(
        private service: PaymentService,
        private helperService: HelperService,
        private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.getListData();
    }

    getListData() {
        this.loading = true;
        this.service.getListData({})
            .pipe(finalize(() => this.cdr.detectChanges()))
            .subscribe((res: any) => {
                this.loading = false;
                console.info("===========[] ===========[] : ",res);
                if (res?.status == 'success') {
                    this.listData = res?.data?.payments || [];
                    this.paging = this.helperService.buildPaging(res?.data?.meta);
                }
            });
    }

}
