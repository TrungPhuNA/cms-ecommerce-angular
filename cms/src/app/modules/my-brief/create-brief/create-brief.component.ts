import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { IndexComponent } from '../index/index.component';
import { AlertService, HelperService } from 'src/app/services';
import { BriefService } from 'src/app/services/brief.service';
import { REGEX_EMAIL, REGEX_LINK_V3, REGEX_NAME } from 'src/app/shared/constants/regex-data';
import moment from 'moment';
import { BRIEF_CONFIG, CRM_CONFIG_DEFAULT } from 'src/app/shared/constants/common-value';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { GoogleAnalyticsService } from 'src/app/services/google-analytics.service';
import { ModalComponent } from '../modal/modal.component';
import { ConfigService } from 'src/app/services/config.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
	selector: 'app-create-brief',
	templateUrl: './create-brief.component.html',
	styleUrls: ['./create-brief.component.scss'],
})
export class CreateBriefComponent implements OnInit {

	loading: boolean = false;

	user_id: any;
	user_info: any;
    username: any;

	fails: any;

	form: any = new FormGroup({
		name: new FormControl(null, Validators.maxLength(255)),
		description: new FormControl(null, Validators.required),
		user_id: new FormControl(null),
		rank_budget: new FormControl(null, [Validators.required]),
		service_type: new FormControl(null, [Validators.required]),
		service_products: new FormArray([]),
		products: new FormControl(null),
		desired_timeline_start: new FormControl(null),
		desired_timeline_end: new FormControl(null),
		info: new FormGroup({
			performance: new FormControl(null, [Validators.required]),
			link: new FormControl(null, [
				Validators.required,
				Validators.pattern(REGEX_LINK_V3)]),
			quantity_sale: new FormControl(null, [Validators.required]),
			usp: new FormControl(null),
			focus_area: new FormControl(null),
			after_sale_policy: new FormControl(null),
			bonus_policy: new FormControl(null),
			viral_info: new FormControl(null),
			customer: new FormControl(null, [Validators.required]),
			conversion_rate: new FormControl(null),
			sla: new FormControl(1),
			scale: new FormControl(null), // truyền từ user adv vào
			career: new FormControl(null), // truyền từ user adv vào
            user_flow: new FormControl(null, [Validators.required]),
		}),
		contact_info: new FormGroup({
			name: new FormControl(null, [
				Validators.required,
				Validators.pattern(REGEX_NAME)
			]),
			phone: new FormControl(null, [
				Validators.required,
				this.formValidatorService.phoneNumberValidator(true)
			]),
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern(REGEX_EMAIL)
			]),
			address: new FormControl(null),
		}),
	});

	quantity_sale_config: any = BRIEF_CONFIG.QUANTITY_SALE;
	focus_area_config: any = BRIEF_CONFIG.FOCUS_AREA;
	service_type_config: any = BRIEF_CONFIG.SERVICE_TYPE;
	service_products_config: any = BRIEF_CONFIG.SERVICE_PRODUCTS.map((item: any) => item);
	rank_budget_config: any = BRIEF_CONFIG.RANK_BUDGET;
	viral_info_config: any = BRIEF_CONFIG.VIRAL_INFO;

	viral_info_list: any = [{
		name: null,
		value: null
	}];
	currentDate = moment().format('yyyy-MM-DD');
	minDateEnd = moment().format('yyyy-MM-DD');
	from_date: any;
	to_date: any;

	submitted = false;

	get info() {
		return this.form.get('info') as FormGroup;
	}

	get link() {
		return this.info.get('link');
	}

	get viral_info() {
		return this.info.get('viral_info')
	}

	get contact_info() {
		return this.form.get('contact_info')
	}
	get service_products() {
		return this.form.get('service_products') as FormArray;
	}

    configs: any = this.configService.getSetting() || {...CRM_CONFIG_DEFAULT};


	constructor(
		private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
		private dialogRef: MatDialogRef<IndexComponent>,
		@Inject(MAT_DIALOG_DATA) data: any,
		private alertService: AlertService,
		private briefService: BriefService,
		public helperService: HelperService,
		private authService: AuthService,
		private formValidatorService: FormValidatorService,
        private gaService: GoogleAnalyticsService,
		private configService: ConfigService,
	) {
		if (data) {
			this.focus_area_config = data.configs?.focus_area;
			this.quantity_sale_config = data.configs?.order_sale;
			this.service_type_config = data.configs?.service_type?.map((item: any) => {
				item.full_name = item.name + ' - ' + item.vn_name;
				return item;
			});
			this.rank_budget_config = data.configs?.rank_budget;

            this.user_info = data.user_info;
            this.user_id = data.user_id;

            if (this.user_info) {
                this.form.patchValue({
                    contact_info: {
                        name: this.user_info.full_name || null,
                        phone: this.user_info.phone || null,
                        email: this.user_info.email || null,
                    }
                });
                
            }
		}
	}

	messageErrorDate: any = null;
	ngOnInit(): void {
		this.formValueChange()
	}

	formValueChange() {
		this.form.get('desired_timeline_start').valueChanges.subscribe((res: any) => {
			if(res) {
				this.minDateEnd = moment(res).format('yyyy-MM-DD');
				this.checkTime(res, this.form.value?.desired_timeline_end);
			}
		});
		this.form.get('desired_timeline_end').valueChanges.subscribe((res: any) => {
			if(res) {
				this.checkTime(this.form?.value?.desired_timeline_start, res);
			}
		});

		this.form.get('service_type')?.valueChanges.subscribe((res: any) => {
			this.service_products_config = BRIEF_CONFIG.SERVICE_PRODUCTS?.filter(item => res?.includes(item?.service_type));
			let products = this.form?.value?.products
			if(products?.length > 0) {
				let productData = BRIEF_CONFIG.SERVICE_PRODUCTS.filter((item: any) => products?.includes(item.value));
				let service_product = productData?.filter((item: any) => res?.includes(item?.service_type));
				this.form.patchValue({
					products: service_product?.map((item: any) => item.value),
				});
				this.patchValueToServiceProduct(service_product);
			} 
		});
	}

	patchValueToServiceProduct(data: any) {
		this.service_products.clear();
		if(data?.length > 0) {
			for(let item of data) {
				let group: FormGroup = new FormGroup({
					value: new FormControl(),
					name: new FormControl(),
					service_type: new FormControl(),
				});
				group.patchValue(item);
				this.service_products.push(group)
			}
		} 
	}

	checkTime(timeStart: any, timeEnd: any) {
		if(timeEnd && timeStart) {
			let check = moment(timeEnd).isBefore(moment(timeStart));
			if(check) {
				this.messageErrorDate = "Ngày bắt đầu không lớn hơn ngày kết thúc"
			} else {
				this.messageErrorDate = null;
			}
		} else {
			this.messageErrorDate = null;
		}
	}

	onClose(data?: any) {
		const dialogConfig = new MatDialogConfig();
        dialogConfig.width = '500px';
        dialogConfig.maxHeight = '95vh';
        dialogConfig.disableClose = false;
        dialogConfig.data = { type: 4 };
        let dialogRef = this.dialog.open(ModalComponent, dialogConfig);
        // action sau khi đóng modal
        dialogRef.afterClosed().subscribe((event: any) => {
            if (event?.close) {
                this.closeForm(data);
            }
        });
	}

	closeForm(data: any) {
		this.form.reset();
		this.dialogRef.close(data);
		if(!this.user_info?.number_of_access || this.user_info?.number_of_access <= 1) {
			let data = {
				number_of_access: (this.user_info?.number_of_access || 1) + 1
			}
			this.authService.updateMe(data).subscribe((res: any) => {
				console.log("response me------> ", res);
			})
		}
	}

	submit() {
		this.submitted = true;
		this.checkTime(this.form.value?.desired_timeline_start, this.form.value?.desired_timeline_end);
		if (this.form.invalid || this.messageErrorDate) {
			this.alertService.fireSmall('error', "Form không đúng định dạng, vui lòng kiểm tra lại.");
			return;
		}
		this.checkValidLink();
		let checkLink = this.link_error_list?.some((item: any) => item == 1);
		if (checkLink) {
			this.alertService.fireSmall('error', "Các kênh online/offline đang chạy không đúng định dạng.");
			return;
		}

		this.viral_info_list.map((item: any) => {
			item.type = BRIEF_CONFIG.VIRAL_INFO.find(el => el.name == item.name)?.type;
			if(item?.value) {
				if (!item?.value?.startsWith('http') && !item?.value.startsWith('https')) 
					item.value = 'https://' + item.value;
			}

			return item;
		});

        let viralInfo: any = this.viral_info_list?.filter((item: any) => item.value && item.type);
		this.form.patchValue({
			info: {
				viral_info: viralInfo?.length > 0 ? viralInfo : null,
				
			}
		});

        if (this.form.value.contact_info?.phone) this.form.value.contact_info.phone = this.convertPhone(this.form.value.contact_info.phone);

		let data: any = {
			...this.form.value,
			
			name: this.form.value.name ? this.form.value.name : 'Tạo ngày ' + moment().format('DD/MM/YYYY'),
			user_id: this.user_id,
		};

        if (!data?.info?.link.startsWith('http') && !data?.info?.link.startsWith('https')) data.info.link = 'https://' + data.info.link;
		data.info = {...data.info, products: data?.products};
		delete data?.products;

		this.loading = true;
		this.briefService.createBrief(data).subscribe(res => {
			if (res.status == 'success') {
                this.gaService.sendEvent('adv_create_brief_success', { username: this.username });
				this.alertService.fireSmall('success', 'Tạo yêu cầu thành công!');
				this.submitted = false;
				this.closeForm({ success: true });
			} else if (res?.status == 'fail_validate') {
				this.fails = res?.data;
				this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
			} else {
				this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
			}
			this.loading = false;
			this.cdr.detectChanges();
		}, error => {
			this.loading = false;
			this.cdr.detectChanges();
		});
	}

	onChange(event: any) {
		if (event?.target?.value) {
			if (this.fails && this.fails['info.link']) this.fails['info.link'] = null;
			if (this.fails && this.fails['info.viral_info']) this.fails['info.viral_info'] = null;
		}
	}

	selectFocusArea(e: any) {
		this.form.patchValue({
			info: {
				focus_area: e
			}
		});
	}

	selectedProducts(e: any) {
		let res = this.form.value.products;
		let service_product = BRIEF_CONFIG.SERVICE_PRODUCTS.filter((item: any) => res?.includes(item.value));
		this.patchValueToServiceProduct(service_product);
	}

	addViralInfo() {
		this.viral_info_list.push({ name: null, value: null, type: 0 });
		this.checkValidLink();
	}

	removeViralInfo(i: any) {
		this.viral_info_list.splice(i, 1);
		this.checkValidLink();
	}

	link_error_list: any = [0];
	checkValidLink() {
		this.link_error_list = this.viral_info_list.reduce((newError: any, item: any) => {
			if (item?.value && !REGEX_LINK_V3.test(item?.value)) {
				newError.push(1);
			} else {
				newError.push(0)
			}
			return newError;
		}, []);
	}

	errorLink(i: any) {
		return this.link_error_list?.find((item: any, index: number) => item > 0 && index == i);
	}

	onChangeViralInfo(e: any, i: any) {
		if (e?.target?.value) {
			this.checkValidLink();
		}
	}

	getDateChange($event: any, key: string) {
		console.log($event);
	}

    convertPhone(phone: any) {
        let lastNumber: any = phone.slice(-9),
            result: any = phone;

        if (phone.substring(0, 3) == '840') result = '84' + lastNumber;
        if (phone.substring(0, 4) == '+840') result = '+84' + lastNumber;

        return result;
    }
}