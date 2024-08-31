import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { BriefService } from 'src/app/services/brief.service';
import { ConfigService } from 'src/app/services/config.service';
import { BRIEF_CONFIG } from 'src/app/shared/constants/common-value';

@Component({
	selector: 'app-brief-child-detail',
	templateUrl: './detail.component.html',
	styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

	@Input() data: any;
	@Input() configs: any;
	@Input() viralInfoName: any;
	@Input() isArrayViralInfo: any

	service_products_config: any = BRIEF_CONFIG.SERVICE_PRODUCTS.map((item: any) => item);


	constructor(
		private cdr: ChangeDetectorRef,
        private activatedRoute: ActivatedRoute,
        private briefService: BriefService,
        private dialog: MatDialog,
		private configService: ConfigService,
	) { }

	ngOnInit(): void {
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
	checkHttpLink(link: any, objKey?: any) {
		if (objKey) {
			let linkData = link;
			if (objKey?.start) {
				linkData = link.startsWith(objKey?.start) ? link : objKey?.start + link;
			}
			if (objKey?.end) {
				linkData = linkData.endsWith(objKey?.end) ? linkData : linkData + objKey?.end
			}
			return linkData;

		}
		return (link.includes('http') || link.includes('https'));
	}
}
