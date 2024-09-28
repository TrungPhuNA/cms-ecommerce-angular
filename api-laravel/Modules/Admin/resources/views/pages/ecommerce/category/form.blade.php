<form id="kt_ecommerce_add_category_form" class="form d-flex flex-column flex-lg-row" action="{{ isset($category) ? route('admin.category.update', $category->id) : route('admin.category.store') }}" method="POST" enctype="multipart/form-data">
    @csrf
    @if(isset($category))
        @method('PUT')
    @endif
    <!--begin::Aside column-->
    <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
        <!--begin::Thumbnail settings-->
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <!--begin::Card title-->
                <div class="card-title">
                    <h2>Thumbnail</h2>
                </div>
                <!--end::Card title-->
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body text-center pt-0">
                <!--begin::Image input-->
                <div class="image-input image-input-empty image-input-outline mb-3" data-kt-image-input="true" style="background-image: url({{ asset('assets/media/svg/files/blank-image.svg') }})">
                    <!--begin::Preview existing avatar-->
                    <div class="image-input-wrapper w-150px h-150px"></div>
                    <!--end::Preview existing avatar-->
                    <!--begin::Label-->
                    <label class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="change" data-bs-toggle="tooltip" title="Change avatar">
                        <!--begin::Icon-->
                        <i class="bi bi-pencil-fill fs-7"></i>
                        <!--end::Icon-->
                        <!--begin::Inputs-->
                        <input type="file" name="avatar" accept=".png, .jpg, .jpeg" />
                        <input type="hidden" name="avatar_remove" />
                        <!--end::Inputs-->
                    </label>
                    <!--end::Label-->
                    <!--begin::Cancel-->
                    <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="cancel" data-bs-toggle="tooltip" title="Cancel avatar">
                        <i class="bi bi-x fs-2"></i>
                    </span>
                    <!--end::Cancel-->
                    <!--begin::Remove-->
                    <span class="btn btn-icon btn-circle btn-active-color-primary w-25px h-25px bg-body shadow" data-kt-image-input-action="remove" data-bs-toggle="tooltip" title="Remove avatar">
                        <i class="bi bi-x fs-2"></i>
                    </span>
                    <!--end::Remove-->
                </div>
                <!--end::Image input-->
                <!--begin::Description-->
                <div class="text-muted fs-7">Set the category thumbnail image. Only *.png, *.jpg and *.jpeg image files are accepted</div>
                <!--end::Description-->
            </div>
            <!--end::Card body-->
        </div>
        <!--end::Thumbnail settings-->
        <!--begin::Status-->
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <!--begin::Card title-->
                <div class="card-title">
                    <h2>Status</h2>
                </div>
                <!--end::Card title-->
                <!--begin::Card toolbar-->
                <div class="card-toolbar">
                    <div class="rounded-circle bg-success w-15px h-15px" id="kt_ecommerce_add_category_status"></div>
                </div>
                <!--begin::Card toolbar-->
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <!--begin::Select2-->
                <select class="form-select mb-2" name="status" data-control="select2" data-hide-search="true" data-placeholder="Select an option" id="kt_ecommerce_add_category_status_select">
                    <option></option>
                    <option value="active"  {{ ($category->status ?? "active") == "active" ? "selected='selected'" : "" }}>Published</option>
                    <option value="inactive"  {{ ($category->status ?? "active") == "inactive" ? "selected='selected'" : "" }}>InActive</option>
                </select>
            </div>
            <!--end::Card body-->
        </div>
        <!--end::Status-->
    </div>
    <!--end::Aside column-->
    <!--begin::Main column-->
    <div class="d-flex flex-column flex-row-fluid gap-7 gap-lg-10">
        <!--begin::General options-->
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <div class="card-title">
                    <h2>General</h2>
                </div>
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <!--begin::Input group-->
                <div class="mb-10 fv-row">
                    <!--begin::Label-->
                    <label class="required form-label">Category Name</label>
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" name="name" class="form-control mb-2" placeholder="Product name" value="{{ $category->name ?? null }}" />
                    <!--end::Input-->
                    <!--begin::Description-->
                    <div class="text-muted fs-7">A category name is required and recommended to be unique.</div>
                    <!--end::Description-->
                </div>
                <!--end::Input group-->
                <!--begin::Input group-->
                <div>
                    <!--begin::Label-->
                    <label class="form-label">Description</label>
                    <!--end::Label-->
                    <textarea name="description" class="form-control" placeholder="Description ....">{{ $category->description ?? null }}</textarea>
                    <!--begin::Description-->
                    <div class="text-muted fs-7">Set a description to the category for better visibility.</div>
                    <!--end::Description-->
                </div>
                <!--end::Input group-->
            </div>
            <!--end::Card header-->
        </div>
        <!--end::General options-->
        <!--begin::Meta options-->
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <div class="card-title">
                    <h2>Meta Options</h2>
                </div>
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <!--begin::Input group-->
                <div class="mb-10">
                    <!--begin::Label-->
                    <label class="form-label">Meta Tag Title</label>
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" class="form-control mb-2" name="title_seo" placeholder="Meta tag name" value="{{ $category->title_seo ?? null }}" />
                    <!--end::Input-->
                    <!--begin::Description-->
                    <div class="text-muted fs-7">Set a meta tag title. Recommended to be simple and precise keywords.</div>
                    <!--end::Description-->
                </div>
                <!--end::Input group-->
                <!--begin::Input group-->
                <div class="mb-10">
                    <!--begin::Label-->
                    <label class="form-label">Meta Tag Description</label>
                    <!--end::Label-->
                    <!--begin::Editor-->
                    <textarea name="description_seo" class="form-control" placeholder="Description ....">{{ $category->description_seo ?? null }}</textarea>
                    <!--end::Editor-->
                    <!--begin::Description-->
                    <div class="text-muted fs-7">Set a meta tag description to the category for increased SEO ranking.</div>
                    <!--end::Description-->
                </div>
            </div>
            <!--end::Card header-->
        </div>
        <!--end::Meta options-->
        <!--begin::Automation-->
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <div class="card-title">
                    <h2>INDEX</h2>
                </div>
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <!--begin::Input group-->
                <div>
                    <!--begin::Label-->
                    <label class="form-label mb-5">Seo category</label>
                    <!--end::Label-->
                    <!--begin::Methods-->
                    <!--begin::Input row-->
                    <div class="d-flex fv-row">
                        <!--begin::Radio-->
                        <div class="form-check form-check-custom form-check-solid">
                            <!--begin::Input-->
                            <input class="form-check-input me-3" name="index_seo" type="radio" value="1" id="kt_ecommerce_add_category_automation_0" {{ ($category->index_seo ?? 1) == 1 ? "checked='checked'" : "" }} />
                            <!--end::Input-->
                            <!--begin::Label-->
                            <label class="form-check-label" for="kt_ecommerce_add_category_automation_0">
                                <div class="fw-bolder text-gray-800">Có</div>
                            </label>
                            <!--end::Label-->
                        </div>
                        <!--end::Radio-->
                    </div>
                    <!--end::Input row-->
                    <div class='separator separator-dashed my-5'></div>
                    <!--begin::Input row-->
                    <div class="d-flex fv-row">
                        <!--begin::Radio-->
                        <div class="form-check form-check-custom form-check-solid">
                            <!--begin::Input-->
                            <input class="form-check-input me-3" name="index_seo" type="radio" value="0" {{ ($category->index_seo ?? 1) == 0 ? "checked='checked'" : "" }} id="kt_ecommerce_add_category_automation_1" />
                            <!--end::Input-->
                            <!--begin::Label-->
                            <label class="form-check-label" for="kt_ecommerce_add_category_automation_1">
                                <div class="fw-bolder text-gray-800">Không</div>
                            </label>
                            <!--end::Label-->
                        </div>
                        <!--end::Radio-->
                    </div>
                    <!--end::Input row-->
                    <!--end::Methods-->
                </div>
            </div>
            <!--end::Card header-->
        </div>
        <!--end::Automation-->
        <div class="d-flex justify-content-end">
            <!--begin::Button-->
            <a href="" id="kt_ecommerce_add_product_cancel" class="btn btn-light me-5">Cancel</a>
            <!--end::Button-->
            <!--begin::Button-->
            <button type="submit" id="kt_ecommerce_add_category_submit" class="btn btn-primary">
                <span class="indicator-label">Save Changes</span>
                <span class="indicator-progress">Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span></span>
            </button>
            <!--end::Button-->
        </div>
    </div>
    <!--end::Main column-->
</form>