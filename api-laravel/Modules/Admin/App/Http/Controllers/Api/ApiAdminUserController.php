<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreCategory;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreUser;
use Modules\Common\Query\UserQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminUserController extends Controller
{
    /**
     * AdmGetListUser
     */
    public function index(Request $request)
    {
        try {
            $paginator = UserQueryService::getAll($request);
            $users = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'users' => $users
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateUser
     */
    public function store(RequestApiStoreUser $request): \Illuminate\Http\JsonResponse
    {
        try {
            $user = UserQueryService::create($request);
            $data = [
                'user' => $user
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowUser
     */
    public function show(Request $request, $id)
    {
        try {
            $user = UserQueryService::findById($id);
            $data = [
                'user' => $user
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateUser
     */
    public function update(RequestApiStoreCategory $request, $id)
    {
        try {
            UserQueryService::update($request, $id);
            $data = [
                'user' => UserQueryService::findById($id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
