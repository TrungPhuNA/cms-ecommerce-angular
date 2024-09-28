<form id="kt_ecommerce_add_category_form" class="form d-flex flex-column flex-lg-row"
      action="{{ isset($attribute) ? route('admin.attributes.update', $attribute->id) : route('admin.attributes.store') }}"
      method="POST" enctype="multipart/form-data">
    @csrf
    @if(isset($attribute))
        @method('PUT')
    @endif
    <!--begin::Aside column-->
    <div class="d-flex flex-column gap-7 gap-lg-10 w-100 w-lg-300px mb-7 me-lg-10">
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
                <select class="form-select mb-2" name="status" data-control="select2" data-hide-search="true"
                        data-placeholder="Select an option" id="kt_ecommerce_add_category_status_select">
                    <option></option>
                    <option value="active" {{ ($category->status ?? "active") == "active" ? "selected='selected'" : "" }}>
                        Published
                    </option>
                    <option value="inactive" {{ ($category->status ?? "active") == "inactive" ? "selected='selected'" : "" }}>
                        InActive
                    </option>
                </select>
            </div>
            <!--end::Card body-->
        </div>
        <div class="card card-flush py-4">
            <!--begin::Card header-->
            <div class="card-header">
                <!--begin::Card title-->
                <div class="card-title">
                    <h2>Sắp xếp</h2>
                </div>
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <input type="number" class="form-control" name="order" value="{{ $attribute->order ?? 0 }}">
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
                    <label class="required form-label">Name</label>
                    <!--end::Label-->
                    <!--begin::Input-->
                    <input type="text" name="name" class="form-control mb-2" placeholder="Name ..."
                           value="{{ $attribute->name ?? null }}"/>
                    <!--end::Input-->
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
                    <h2>Danh sách thuộc tính</h2>
                </div>
            </div>
            <!--end::Card header-->
            <!--begin::Card body-->
            <div class="card-body pt-0">
                <!--begin::Input group-->
                <div class="mb-10">
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Is Default?</th>
                            <th>Title</th>
                            <th>Color</th>
                            <th>Image</th>
                            <th>Remove</th>
                        </tr>
                        </thead>
                        <tbody id="attribute-list">
                            @if(isset($attributeValues) && !empty($attributeValues))
                                @foreach($attributeValues as $key => $attributeValue)
                                    <input type="hidden" name="ids[]" value="{{ $attributeValue->id }}">
                                <tr class="attribute-row">
                                    <td class="index">{{ $key + 1 }}</td>
                                    <td>
                                        <input type="radio" name="is_default[]" class="form-check-input" {{ $attributeValue->is_default == 1 ? 'checked' : '' }} value="1">
                                    </td>
                                    <td>
                                        <input type="text" name="title[]" class="form-control" placeholder="Enter title" value="{{ $attributeValue->title }}">
                                    </td>
                                    <td>
                                        <input type="color" name="color[]" class="form-control" value="{{ $attributeValue->color }}" style="height: 40px">
                                    </td>
                                    <td>
                                        @if($attributeValue->image)
                                            <img src="{{ $attributeValue->image }}" alt="">
                                        @else
                                            <input type="text" name="image[]" class="form-control">
                                        @endif
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-danger remove-attribute" style="height: 40px">🗑</button>
                                    </td>
                                </tr>
                                @endforeach
                            @else
                                <tr class="attribute-row">
                                    <td class="index">1</td>
                                    <td>
                                        <input type="radio" name="is_default[]" class="form-check-input" checked value="1">
                                    </td>
                                    <td>
                                        <input type="text" name="title[]" class="form-control" placeholder="Enter title">
                                    </td>
                                    <td>
                                        <input type="color" name="color[]" class="form-control" style="height: 40px">
                                    </td>
                                    <td>
                                        <input type="text" name="image[]" class="form-control">
                                    </td>
                                    <td>
                                        <button class="btn btn-sm btn-danger remove-attribute" style="height: 40px">🗑</button>
                                    </td>
                                </tr>
                            @endif
                        </tbody>
                    </table>
                    <button class="btn btn-primary" id="add-attribute">Add new attribute</button>
                </div>
            </div>
            <!--end::Card header-->
        </div>
        <!--end::Meta options-->
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
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
    $(document).ready(function () {
        // Add new attribute row
        $('#add-attribute').click(function (e) {
            e.preventDefault();
            var rowCount = $('#attribute-list tr').length + 1;
            var newRow = `
                <tr class="attribute-row">
                    <td class="index">${rowCount}</td>
                    <td>
                        <input type="radio" name="is_default[]" class="form-check-input" value="1">
                    </td>
                    <td>
                        <input type="text" name="title[]" class="form-control" placeholder="Enter title">
                    </td>
                    <td>
                        <input type="color" name="color[]" class="form-control" style="height: 40px">
                    </td>
                    <td>
                        <input type="text" name="image[]" class="form-control">
                    </td>
                    <td>
                        <button class="btn btn-danger remove-attribute" style="height: 40px">🗑</button>
                    </td>
                </tr>
            `;
            $('#attribute-list').append(newRow);
            updateIndex();
        });

        // Remove attribute row
        $(document).on('click', '.remove-attribute', function () {
            $(this).closest('tr').remove();
            updateIndex(); // Cập nhật lại số thứ tự
        });

        // Cập nhật lại số thứ tự khi thêm/xóa dòng
        function updateIndex() {
            $('#attribute-list .attribute-row').each(function (index) {
                $(this).find('.index').text(index + 1);
            });
        }
    });
</script>