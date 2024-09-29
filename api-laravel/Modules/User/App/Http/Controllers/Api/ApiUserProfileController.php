<?php

namespace Modules\User\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;
use Modules\User\Service\UserProfileService;

class ApiUserProfileController extends Controller
{
    /**
     * Profile
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getProfile(Request $request)
    {
        try {
            $user = auth()->user();
            $user->load('types');
            return ResponseService::sendSuccess([
                'user' => $user
            ]);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * Update Profile
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = UserProfileService::updateProfile($request);
            return ResponseService::sendSuccess([
                'user' => $user
            ]);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
