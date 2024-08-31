import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DetailBriefComponent } from '../detail-brief/detail-brief.component';
import { AlertService } from 'src/app/services';
import { BriefService } from 'src/app/services/brief.service';
import { isObject } from 'lodash';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

    showApproved: boolean = false;
    showApporvedSuccess: boolean = false;
    showRejected: boolean = false;
    showReason: boolean = false;
    text: string;
    showAlertCloseCreate: boolean = false;
        
    loading: boolean = false;

    id: any;
    reason: string;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialogRef: MatDialogRef<DetailBriefComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private alertService: AlertService,
        private briefService: BriefService
    ) {

        this.id = data?.id;
        if (data?.type == 1) this.showApproved = true;
        if (data?.type == 2) this.showRejected = true;

        if (data?.type == 3) {
            this.showReason = true;
            this.text = isObject(data?.reason) ? data?.reason?.note : data?.reason;
        }

        if (data?.type == 4) this.showAlertCloseCreate = true;
    }

    ngOnInit(): void {

    }

    onClose(data?: any) {
        this.dialogRef.close(data);
    }

    submit() {
        this.loading = true;
        this.briefService.updateBriefStatus(this.id, { status: 5, reason: this.reason }).subscribe(res => {
            if (res.status == 'success') {
                this.onClose({ success: true });
            } else this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
            this.loading = false;
            this.cdr.detectChanges();
        }, error => {
            this.loading = false;
            this.cdr.detectChanges();
        });
    }

    approve() {
        this.loading = true;
        this.briefService.updateBriefStatus(this.id, { status: 6 }).subscribe(res => {
            if (res.status == 'success') {
                this.showApporvedSuccess = true;
            } else {
                this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
            }
            this.loading = false;
            this.cdr.detectChanges();
        });
    }
}
