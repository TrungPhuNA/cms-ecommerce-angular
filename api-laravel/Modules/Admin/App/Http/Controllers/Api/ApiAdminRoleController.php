<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\RoleQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminRoleController extends Controller
{
    /**
     * AdmGetListRole
     */
    public function index(Request $request)
    {
        try {
            $paginator = RoleQueryService::getAll($request);
            $roles = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'       => $meta,
                'roles' => $roles
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateRole
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $role = RoleQueryService::create($request);
            $data = [
                'role' => $role
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowRole
     */
    public function show(Request $request, $id)
    {
        try {
            $role = RoleQueryService::findById($request, $id);
            $data = [
                'role' => $role
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateRole
     */
    public function update(Request $request, $id)
    {
        try {
            RoleQueryService::update($request, $id);
            $data = [
                'role' => RoleQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
