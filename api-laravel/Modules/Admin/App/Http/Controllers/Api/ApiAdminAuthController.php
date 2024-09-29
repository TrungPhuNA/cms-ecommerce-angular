<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;
use Modules\User\App\Http\Requests\Api\RequestApiLoginUser;
use Modules\User\App\Http\Requests\Api\RequestApiRegisterUser;
use Modules\User\Service\RegisterServiceUser;

class ApiAdminAuthController extends Controller
{
    /**
     * Register
     * @param  RequestApiRegisterUser  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RequestApiRegisterUser $request)
    {
        try {
            $user = RegisterServiceUser::register($request);
            return ResponseService::sendSuccess([
                'data' => $user
            ]);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * Login
     */
    public function login(RequestApiLoginUser $request)
    {
        try {
            $user = RegisterServiceUser::login($request);
            return ResponseService::sendSuccess([
                'user' => $user
            ]);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
