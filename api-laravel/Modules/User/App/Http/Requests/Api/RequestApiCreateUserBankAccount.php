<?php

namespace Modules\User\App\Http\Requests\Api;

use Modules\Common\Base\BaseFormRequest;

class RequestApiCreateUserBankAccount extends BaseFormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'bank_id'        => 'required',
            'account_number' => 'required',
            'account_name'   => 'required',
            'bank_branch'    => 'required',
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
