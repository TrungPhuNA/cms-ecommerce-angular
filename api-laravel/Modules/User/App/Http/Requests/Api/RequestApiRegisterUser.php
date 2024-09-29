<?php

namespace Modules\User\App\Http\Requests\Api;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class RequestApiRegisterUser extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'email'     => 'required|unique:users',
            'name'      => 'required|min:5',
            'phone'     => 'required',
            'password'  => 'required|min:8',
            'type_name' => 'required|in:ADMIN,USER',
        ];
    }

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'status'  => 'fail_validate',
            'message' => 'Validation errors',
            'data'    => $validator->errors()
        ]));
    }
}
