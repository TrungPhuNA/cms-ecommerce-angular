<?php

namespace Modules\Admin\App\Http\Requests\Api;

use Modules\Common\Base\BaseFormRequest;

class RequestApiStoreWalletAdmin extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'user_id' => 'required',
            'amount'  => 'required'
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
