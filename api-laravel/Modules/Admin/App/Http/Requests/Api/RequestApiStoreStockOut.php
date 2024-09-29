<?php

namespace Modules\Admin\App\Http\Requests\Api;

use Modules\Common\Base\BaseFormRequest;

class RequestApiStoreStockOut extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'product_id' => 'required',
            'quantity'   => 'required',
            'price'      => 'required',
            'date'       => 'required',
            'user_id'    => 'required',
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
