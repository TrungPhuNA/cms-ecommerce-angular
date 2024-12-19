<?php

namespace Modules\Admin\App\Http\Requests\Api;

use Modules\Common\Base\BaseFormRequest;

class RequestApiStoreUser extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email'    => 'required|unique:users',
            'name'     => 'required',
            'phone'    => 'required',
            'password' => 'required|min:8',
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
