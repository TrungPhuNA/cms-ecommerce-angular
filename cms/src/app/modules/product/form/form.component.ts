import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { NgxSummernoteDirective } from 'ngx-summernote';
import { finalize } from 'rxjs';
import { AlertService, FileUploadService, HelperService, ProductService } from 'src/app/services';
import { CategoryService } from 'src/app/services/category.service';
import { ALERT_ERROR, ALERT_SUCCESS, Breadcrumb, FileUploadModel, HomeBreadcrumb } from 'src/app/shared';
import { STATUS_PRODUCTS } from 'src/app/shared/constants/common';
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
	listCategories = [];
	loading = false;

	statuses = STATUS_PRODUCTS;

	images = [new FileUploadModel(null, null, true, '')];

	form = new FormGroup({
		name: new FormControl(null, Validators.required),
		number: new FormControl(null, Validators.required),
		price: new FormControl(null, Validators.required),
		category_id: new FormControl(null, Validators.required),
		status: new FormControl(null, Validators.required),
		description: new FormControl(null, Validators.required),
		avatar: new FormControl(null)
	});


	requiredForm = "Trường này không được để trống.";

	@ViewChild(NgxSummernoteDirective) summernote: NgxSummernoteDirective;
	public config: any = {
		placeholder: 'Nội dung',
		tabsize: 2,
		height: '200px',
		// uploadImagePath: 'https://hq3-api.dev.accesstrade.me/api/v1/file-upload',
		toolbar: [
			['misc', ['codeview', 'undo', 'redo']],
			['style', ['bold', 'italic', 'underline', 'clear']],
			['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
			['fontsize', ['fontname', 'fontsize', 'color']],
			['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
			['insert', ['table', 'picture', 'link', 'video', 'hr']]
		],
		fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times']
	}
	constructor(
		public helperService: HelperService,
		private alertService: AlertService,
		private service: ProductService,
		private categoryService: CategoryService,
		private cdr: ChangeDetectorRef,
		private activeRoute: ActivatedRoute,
		private uploadService: FileUploadService

	) {


	}
	ngOnInit(): void {
		this.getListCategory({ page: 1, page_size: 1000 })
		this.activeRoute.params.subscribe((res: any) => {
			this.breadcrumbs = [
				new HomeBreadcrumb(),
				new Breadcrumb('Sản phẩm', '/product'),
				new Breadcrumb(res?.id ? 'Cập nhật' : 'Tạo mới', ''),
			];
			if(res?.id) {
				this.getDetail(res?.id);
			}
		});
	}

	getListCategory(filters: any) {
		this.categoryService.getListData(filters)
			.pipe(finalize(() => this.cdr.detectChanges()))
			.subscribe((res: any) => {
				if (res?.status == 'success') {
					this.listCategories = res?.data?.categories;
				}
			})
	}

	getDetail(id: any) {
		this.loading = true;
		this.service.showData(id)
		.pipe(finalize(() => this.cdr.detectChanges()))
		.subscribe((res: any) => {
			this.loading = false;
			if(res?.status == 'success') {
				this.data = res?.data?.product;
				if(this.data) {
					this.form.enable();
					this.form.patchValue({
						...this.data
					});
					let avatar = this.helperService.buildImage(this.data?.avatar);
					this.images = [new FileUploadModel(null, avatar, true, avatar)];
				} else {
					this.alertService.fireSmall("error",ALERT_ERROR.not_found);
					this.form.disable();
				}
			} else {
				this.alertService.fireSmall("error",res?.message ||  ALERT_ERROR.not_found)
			}
		})
	}

	submit() {
		this.submitted = true;
		if(this.form.invalid) {
			return;
		}
		let file = this.images[0]?.fileInfo;

		this.loading = true;
		if(file) {
			this.uploadService.upload(file).pipe((finalize(() => this.cdr.detectChanges())))
			.subscribe((res: any) => {
				if(res?.status == 'success') {
					this.form.patchValue({
						avatar: res?.data?.file_name
					});
					this.createOrUpdateProduct();
				} else {
					this.alertService.fireSmall('error', res?.message);
					this.loading = false;
				}
			})
		} else {
			this.createOrUpdateProduct();
		}
		
	}

	createOrUpdateProduct() {
		this.service.createOrUpdateData(this.form.value, this.data?.id)
		.pipe(finalize(() => this.cdr.detectChanges()))
		.subscribe((res: any) => {
			this.loading = false;
			if(res?.status == 'success') {
				this.submitted = false;
				this.alertService.fireSmall("success", ALERT_SUCCESS.create)
			} else {
				this.alertService.fireSmall("error",res?.message ||  ALERT_ERROR.create)

			}
		})
	}

	getImages(e: any) {
		this.images = e;
	}

	handleUpload(e: any) {

	}

	imageToRemove(e: any) {
		console.log("imageToRemove--------> ", e);
	}

	logEvent(e: any) {
		if (e) {
		  this.form.patchValue({ description: e });
		}
	  }


}
