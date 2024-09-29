<?php

namespace Modules\Admin\App\Http\Requests\Api;

use Modules\Common\Base\BaseFormRequest;

class RequestApiStoreProduct extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name'        => 'required',
            'category_id' => 'required',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
