<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Common\Query\AttributeQueryService;
use Modules\Common\Query\ProductOptionQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminProductOptionController extends Controller
{
    /**
     * AdmGetListAttribute
     */
    public function index(Request $request)
    {
        try {
            $paginator = ProductOptionQueryService::getAll($request);
            $options = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'       => $meta,
                'options' => $options
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
            $option = ProductOptionQueryService::create($request);
            $data = [
                'option' => $option
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
            $option = ProductOptionQueryService::findById($request, $id);
            $data = [
                'option' => $option
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
            ProductOptionQueryService::update($request, $id);
            $data = [
                'option' => ProductOptionQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
