<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreCategory;
use Modules\Common\Query\AttributeQueryService;
use Modules\Common\Query\CategoryQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminAttributeController extends Controller
{
    /**
     * AdmGetListAttribute
     */
    public function index(Request $request)
    {
        try {
            $paginator = AttributeQueryService::getAll($request);
            $attributes = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'       => $meta,
                'attributes' => $attributes
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
            $attribute = AttributeQueryService::create($request);
            $data = [
                'attribute' => $attribute
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
            $attribute = AttributeQueryService::findById($request, $id);
            $data = [
                'attribute' => $attribute
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
            AttributeQueryService::update($request, $id);
            $data = [
                'attribute' => AttributeQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
