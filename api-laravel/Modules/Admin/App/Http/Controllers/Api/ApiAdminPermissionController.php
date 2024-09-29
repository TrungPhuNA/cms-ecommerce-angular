<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\PermissionQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminPermissionController extends Controller
{
    /**
     * AdmGetListPermission
     */
    public function index(Request $request)
    {
        try {
            $paginator = PermissionQueryService::getAll($request);
            $permissions = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'       => $meta,
                'permissions' => $permissions
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreatePermission
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $permission = PermissionQueryService::create($request);
            $data = [
                'permission' => $permission
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowPermission
     */
    public function show(Request $request, $id)
    {
        try {
            $permission = PermissionQueryService::findById($request, $id);
            $data = [
                'permission' => $permission
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdatePermission
     */
    public function update(Request $request, $id)
    {
        try {
            PermissionQueryService::update($request, $id);
            $data = [
                'role' => PermissionQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
