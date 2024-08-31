import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BriefService } from 'src/app/services/brief.service';
import { ModalComponent } from '../modal/modal.component';
import { ConfigService } from 'src/app/services/config.service';
import { isArray } from 'lodash';
import { AlertService } from 'src/app/services';
import { BRIEF_CONFIG, CRM_CONFIG_DEFAULT } from 'src/app/shared/constants/common-value';
import moment from 'moment';
import { REGEX_EMAIL, REGEX_LINK_V3, REGEX_NAME } from 'src/app/shared/constants/regex-data';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';

@Component({
    selector: 'app-detail-brief',
    templateUrl: './detail-brief.component.html',
    styleUrls: ['./detail-brief.component.scss']
})
export class DetailBriefComponent implements OnInit {

    loading: boolean = false;

    id: any;
    data: any;

    fails: any;

    configs: any = this.configService.getSetting() || {...CRM_CONFIG_DEFAULT};

    showInputReason: boolean = false;

    selection: any = [
        { value: 1, label: 'Duyệt' },
        { value: 2, label: 'Từ chối' }
    ];
    approved: boolean = false;
    rejected: boolean = false;
	// configs: any;

    viralInfoName: any = [];
    isArrayViralInfo: boolean;
    
    constructor(
        private cdr: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private briefService: BriefService,
        private dialog: MatDialog,
		private configService: ConfigService,
		private formValidatorService: FormValidatorService,
        private alertService: AlertService
    ) {
    }

    ngOnInit(): void {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
		this.getDetail(true);
    }

	

    getDetail(loading?: boolean) {
        this.loading = loading == false ? loading : true;
        this.briefService.showBrief(this.id).subscribe(res => {
            this.loading = false;
            if (res.status == 'success') {
                this.data = res.data?.briefs;
				if(this.data) {
                    let quantity_sale: any = this.configs?.order_sale?.find((e: any) => e.value == this.data?.info?.quantity_sale);
                    let service_type: any = this.data?.service_type?.reduce((newItem: any, item: any) => {
						let dataConfig = this.configs?.service_type?.find((e: any) => e?.value == item)?.full_name;
						if(dataConfig) {
							newItem.push(dataConfig);
						}
						return newItem;
					}, []) ;
                    let focus_area: any = this.data?.info?.focus_area?.reduce((newItem: any, item: any) => {
						let dataConfig = this.configs?.focus_area?.find((e: any) => e?.value == item)?.name;
						if(dataConfig) {
							newItem.push(dataConfig);
						}
						return newItem;
					}, []) ;

                    if (isArray(this.data.info?.viral_info)) {
						this.viralInfoName = this.data.info?.viral_info?.reduce((newData: any, item: any) => {
							if(item?.value && item?.name) {
								newData.push({ name: item.name, value: item.value });
								this.isArrayViralInfo = true;
							}
							return newData;
						}, []);
                    }
                    
					this.data = {
						...this.data,
						products: this.data?.service_products?.map((item: any) => item.value) || [],
						budget: this.configs?.rank_budget?.find((item: any) => item.value == this.data?.rank_budget)?.name,
                        quantitySaleName: quantity_sale ? quantity_sale.name : null,
						serviceTypeName: service_type,
						focusAreaName: focus_area
					}
				}
            } else {
				this.alertService.fireSmall('error', res?.message || "Có lỗi xảy ra, vui lòng thử lại.")
			}
            this.cdr.detectChanges();
        }, error => {
            this.loading = false;
            this.cdr.detectChanges();
        });
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

    openModal(type: any) { // approve = 1, reject = 2, view reason = 3
        const dialogConfig = new MatDialogConfig();
        
        if (type == 1) {
            dialogConfig.width = '500px';
            dialogConfig.maxHeight = '95vh';
            dialogConfig.disableClose = true;
        }
        
        if (type == 2) {
            dialogConfig.width = '400px';
            dialogConfig.maxHeight = '95vh';
            dialogConfig.disableClose = true;
        }

        if (type == 3) {
            dialogConfig.width = '550px';
            dialogConfig.maxHeight = '95vh';
            dialogConfig.disableClose = false;
        }

        dialogConfig.data = { 
			type: type, 
			id: this.id, 
			reason: this.data?.reason,
		 };

        let dialogRef = this.dialog.open(ModalComponent, dialogConfig);

        // action sau khi đóng modal
        dialogRef.afterClosed().subscribe((event: any) => {
            if (event?.success) {
                this.getDetail(false);
            }
        });
    }

    checkHttpLink(link: any, objKey?: any) {
		if(objKey) {
			let linkData = link; 
			if(objKey?.start) {
				linkData = link.startsWith(objKey?.start) ? link : objKey?.start + link;
			}
			if(objKey?.end) {
				linkData = linkData.endsWith(objKey?.end) ? linkData : linkData + objKey?.end
			} 
			return linkData;
			
		}
        return (link.includes('http') || link.includes('https'));
    }

}
