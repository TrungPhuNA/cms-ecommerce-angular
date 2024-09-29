<?php

namespace Modules\User\App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RequestApiLoginUser extends FormRequest
{
    public function rules(): array
    {
        return [
            'email'    => 'required',
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
