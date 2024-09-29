<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\AttributeValueQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminAttributeValueController extends Controller
{
    /**
     * AdmGetListAttribute
     */
    public function index(Request $request)
    {
        try {
            $paginator = AttributeValueQueryService::getAll($request);
            $attributesValue = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'            => $meta,
                'attributesValue' => $attributesValue
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateAttribute
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $attributesValue = AttributeValueQueryService::create($request);
            $data = [
                'attributesValue' => $attributesValue
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowAttribute
     */
    public function show(Request $request, $id)
    {
        try {
            $attributesValue = AttributeValueQueryService::findById($request, $id);
            $data = [
                'attributesValue' => $attributesValue
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateAttribute
     */
    public function update(Request $request, $id)
    {
        try {
            AttributeValueQueryService::update($request, $id);
            $data = [
                'attributesValue' => AttributeValueQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
