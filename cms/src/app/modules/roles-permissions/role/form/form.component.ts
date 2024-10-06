import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AccountService, AlertService, FileUploadService, HelperService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { STATUS_PRODUCTS, VALIDATOR_MESSAGES } from 'src/app/shared/constants/common';
import { PERMISSION_GROUPS } from 'src/app/shared/constants/permission';

@Component({
	selector: 'app-form',
	templateUrl: './form.component.html',
	styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

	breadcrumbs: any;
	title = 'Danh sách';
	data: any;
	id: any;
	submitted = false;

	listData = [];
	loading = false;

	statuses = STATUS_PRODUCTS;

	images = [new FileUploadModel(null, null, true, '')];

	form = new FormGroup({
		name: new FormControl(null, Validators.required),
		permissions: new FormArray([]),
		full_permission: new FormControl(null),
		guard_name: new FormControl('api'),
	});


	validatorMessages = VALIDATOR_MESSAGES;

	get permissions() {
		return this.form.get('permissions') as FormArray;
	}

	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: AccountService,
		private categoryService: CategoryService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private router: Router,
		private uploadService: FileUploadService

	) {


	}

	ngOnInit(): void {
		this.activeRoute.params.subscribe((res: any) => {
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb('Role', '/account/setting/role/list'),
				new Breadcrumb(res?.id ? 'Cập nhật' : 'Tạo mới', ''),
			];
			this.getListPermissions({ page: 1, page_size: 1000 }, res?.id);
		});

		this.form.get('full_permission')?.valueChanges.subscribe((res: any) => {
			this.buildPermission(this.listData, {check_all: res})
		})
	}



	getListPermissions(filters: any, id?: any) {
		this.service.getListPermission(filters).subscribe((res: any) => {
				console.log(res);
				if (res?.status == 'success') {
					this.listData = res?.data?.permissions;
					if (id) {
						this.getDetail(id);
					} else {
						this.buildPermission(this.listData);
						this.cdr.detectChanges()
					}
				}
			});
	}

	getDetail(id: any) {
		this.loading = true;
		this.service.showRole(id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.data = res?.data?.role;
					if (this.data) {
						this.form.enable();
						this.form.patchValue({
							...this.data
						});
						this.buildPermission(this.listData)
					} else {
						this.alertService.fireSmall("error", ALERT_ERROR.not_found);
						this.form.disable();
					}
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.not_found)
				}
			})
	}

	submit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		this.createOrUpdateProduct();

	}

	permissionsForm: any;
	buildPermission(resData: any, params?: any) {
		let dataGroup = resData?.reduce((groups: any, item: any) => {
			if (item.group) {
				const group = (groups[item.group] || []);
				group.push(item);
				groups[item.group] = group;
			}
			return groups;
		}, {});
		console.log("dataGroup-------------> ", dataGroup, params);
		if (dataGroup) {
			this.permissionsForm = Object.entries(dataGroup);
		}
		this.form.controls['permissions'] = new FormArray([]);
		if (this.permissionsForm?.length > 0) {
			this.permissionsForm?.forEach((element: any) => {
				let arr_permission = element[1].reduce((per: any, item: any) => {
					let index = -1;
					if (this.data) {
						index = this.data?.permissions?.findIndex((per: any) => per.id == item.id);
					}
					per.push(
						new FormGroup({
							name: new FormControl(item.name),
							id: new FormControl(item.id),
							check: new FormControl(params?.check_all ?true: (index > -1 ? true : false)),
							item: new FormControl(item)
						})
					);
					return per;
				}, new FormArray([]));

				console.log("arr_permission-------> ", arr_permission);
				let groupName = PERMISSION_GROUPS?.find((e:any) => e?.value == element[0]);
				console.log(groupName);
				this.permissions.push(new FormGroup({
					group: new FormControl(element[0]),
					// show: new FormControl(show),
					group_name: new FormControl(groupName?.en_name),
					list_role: arr_permission,
				}));
			});
			console.log(this.permissions);
		}
	}

	getListRoleControls(item: any) {
		return item.get('list_role')?.controls;
	}

	changeGroup($event: any) {
		this.buildPermission(this.listData, $event?.value);
	}

	createOrUpdateProduct() {
		if(this.form.invalid) {
			return;
		}
		console.log(this.permissions?.value);
		let dataPermissions = this.permissions.value?.reduce((newData: any, item: any) => {
			let listDataCheck = item?.list_role?.filter((e: any) => e?.check)?.map((e: any) => e?.id);
			newData = newData.concat(listDataCheck);
			return newData;
		}, []);
		console.log("dataPermissions-------> ", dataPermissions);
		let data = {
			name: this.form?.value?.name,
			permissions: dataPermissions
		}
		this.loading = true;
		this.service.createOrUpdateRole(data, this.data?.id)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				this.loading = false;
				if (res?.status == 'success') {
					this.submitted = false;
					this.alertService.fireSmall("success", ALERT_SUCCESS.create);
					this.router.navigate(['/account/setting/role/list'])
				} else {
					this.alertService.fireSmall("error", res?.message || ALERT_ERROR.create)

				}
			})
	}
}

