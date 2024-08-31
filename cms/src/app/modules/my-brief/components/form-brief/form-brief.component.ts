import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import moment from 'moment';
import { AlertService, HelperService } from 'src/app/services';
import { BriefService } from 'src/app/services/brief.service';
import { FormValidatorService } from 'src/app/services/common/form-validation.service';
import { BRIEF_CONFIG, CRM_CONFIG_DEFAULT } from 'src/app/shared/constants/common-value';
import { REGEX_EMAIL, REGEX_LINK_V3, REGEX_NAME } from 'src/app/shared/constants/regex-data';
import { ModalComponent } from '../../modal/modal.component';
import { ShowPopupConfirmComponent } from 'src/app/shared/components/show-popup-confirm/show-popup-confirm.component';

@Component({
	selector: 'app-form-brief',
	templateUrl: './form-brief.component.html',
	styleUrls: ['./form-brief.component.scss']
})
export class FormBriefComponent implements OnInit {

	@Input() data: any;
	@Input() configs: any = { ...CRM_CONFIG_DEFAULT };
	@Output() resetForm = new EventEmitter()


	user_id: any;
	user_info: any;
	username: any;

	loading = false;


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
	messageErrorDate: any = null;


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


	constructor(
		private cdr: ChangeDetectorRef,
		private briefService: BriefService,
		private formValidatorService: FormValidatorService,
		private alertService: AlertService,
		public helperService: HelperService,
		private dialog: MatDialog,

	) {
	}

	ngOnChanges(): void {
		if (this.data) {
			this.patchData(this.data);
		}

	}
	ngOnInit(): void {
		this.formValueChange();
	}

	patchData(data: any) {
		if (typeof data?.service_type == 'string') {
			data.service_type = [data?.service_type];
		}
		let service_provider_ids = data?.service_bu?.map((item: any) => item?.pivot?.service_providers_id) || null;
		let products = data?.service_products?.map((item: any) => item.value);
		this.service_products_config = BRIEF_CONFIG.SERVICE_PRODUCTS?.filter((item: any) => data?.service_type?.includes(item?.service_type));
		this.form.patchValue({
			// service_provider_ids: service_provider_ids,// Xóa khi update data
			info_user: data?.info_user,
			name: data?.name,
			products: products,
			service_products: data?.service_products || [],
			description: data?.description,
			// user_id: data?.user_id,
			rank_budget: data?.rank_budget,
			// status: data?.status,
			service_type: data?.service_type,
			// proposal: data?.proposal,
			// priority: data?.priority,
			// follow_id: data?.follow_id,
			// manage_id: data?.manage_id,
			// level: data?.level,
			desired_timeline_start: data?.desired_timeline_start ? moment(data?.desired_timeline_start).format('yyyy-MM-DD') : null,
			desired_timeline_end: data?.desired_timeline_end ? moment(data?.desired_timeline_end).format('yyyy-MM-DD') : null,
			// actual_timeline_start: data?.actual_timeline_start ? moment(data?.actual_timeline_start).format('yyyy-MM-DD') : null,
			// actual_timeline_end: data?.actual_timeline_end ? moment(data?.actual_timeline_end).format('yyyy-MM-DD') : null,
		});

		if (data?.info) {
			this.info.patchValue({
				...data?.info,
				career: Number(data?.info?.business_type || data?.user?.company?.business_type || 0),
				scale: Number(data?.info?.member_range || data?.user?.company?.member_range || 0)
			});


			// this.info.disable();
		}
		if (data?.contact_info) {
			this.contact_info.patchValue({ ...data?.contact_info });

		}

		if (data?.info?.viral_info?.length > 0) {
			this.viral_info_list = data?.info?.viral_info;
		}
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

	formValueChange() {
		this.form.get('desired_timeline_start').valueChanges.subscribe((res: any) => {
			if (res) {
				this.minDateEnd = moment(res).format('yyyy-MM-DD');
				this.checkTime(res, this.form.value?.desired_timeline_end);
			}
		});
		this.form.get('desired_timeline_end').valueChanges.subscribe((res: any) => {
			if (res) {
				this.checkTime(this.form?.value?.desired_timeline_start, res);
			}
		});

		this.form.get('service_type')?.valueChanges.subscribe((res: any) => {
			this.service_products_config = BRIEF_CONFIG.SERVICE_PRODUCTS?.filter(item => res?.includes(item?.service_type));
			let products = this.form?.value?.products;
			console.log("change ------> ", products);
			if (products?.length > 0) {
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
		if (data?.length > 0) {
			for (let item of data) {
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
		if (timeEnd && timeStart) {
			let check = moment(timeEnd).isBefore(moment(timeStart));
			if (check) {
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
		dialogConfig.data = { type: 4, component: FormBriefComponent };
		let dialogRef = this.dialog.open(ModalComponent, dialogConfig);
		// action sau khi đóng modal
		dialogRef.afterClosed().subscribe((event: any) => {
			if (event?.close) {
				this.closeForm();
			}
		});
	}

	closeForm() {
		this.form.reset();
		this.viral_info_list = [{
			name: null,
			value: null
		}];
		this.patchData(this.data);
		this.checkValidLink();

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
			if (item?.value) {
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

		let body: any = {
			...this.form.value,

			name: this.form.value.name ? this.form.value.name : 'Tạo ngày ' + moment().format('DD/MM/YYYY'),
			user_id: this.user_id,
		};

		if (!body?.info?.link.startsWith('http') && !body?.info?.link.startsWith('https')) body.info.link = 'https://' + body.info.link;
		body.info = { ...body.info, products: body?.products };
		delete body?.products;
		this.openModalConfirmUpdate({...body, status: 1})



	}

	openModalConfirmUpdate(body: any) {
		const dialogConfig = new MatDialogConfig();
		dialogConfig.width = '500px';
		dialogConfig.maxHeight = '95vh';
		dialogConfig.disableClose = true;
		dialogConfig.data = {
			icon: './assets/media/icons/circle-warning.svg',
			title: 'Vui lòng xem lại thật kỹ nội dung của bạn khai báo',
			content: 'Thông tin bạn khai báo sẽ là căn cứ để chúng tôi xét duyệt yêu cầu và không thể chỉnh sửa sau khi đã "Hoàn tất".',
			config: {
				showCancel: true,
				confirmText: "Xem lại",
				cancelText: "Hoàn tất",
				classTitle: "text-center",
				classContent: "text-center"
			}
		};
		let dialogRef = this.dialog.open(ShowPopupConfirmComponent, dialogConfig);
		// action sau khi đóng modal
		dialogRef.afterClosed().subscribe((event: any) => {
			if (!event?.confirmed) {
				this.loading = true;
				this.briefService.updateBrief(this.data?.id, body).subscribe(res => {
					if (res.status == 'success') {
						// this.gaService.sendEvent('adv_create_brief_success', { username: this.username });
						this.alertService.fireSmall('success', 'Cập nhật yêu cầu thành công!');
						this.submitted = false;
						this.resetForm.emit(true)
					} else if (res?.status == 'fail_validate') {
						this.fails = res?.data;
						this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
					} else {
						this.alertService.fireSmall('error', res?.message || 'Có lỗi xảy ra!');
					}
					this.loading = false;
					this.cdr.detectChanges();
				});
			}
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
		this.link_error_list = this.viral_info_list?.reduce((newError: any, item: any) => {
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
