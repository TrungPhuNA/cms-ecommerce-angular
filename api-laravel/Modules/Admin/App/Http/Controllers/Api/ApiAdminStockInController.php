<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreProduct;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreStockIn;
use Modules\Common\Query\StockInQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminStockInController extends Controller
{
    /**
     * AdmGetListProduct
     */
    public function index(Request $request)
    {
        try {
            $paginator = StockInQueryService::getAll($request);
            $stockIns = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'     => $meta,
                'stockIns' => $stockIns
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateProduct
     */
    public function store(RequestApiStoreStockIn $request): \Illuminate\Http\JsonResponse
    {
        try {
            $stockIn = StockInQueryService::create($request);
            $data = [
                'stockIn' => $stockIn
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowCategory
     */
    public function show(Request $request, $id)
    {
        try {
            $stockIn = StockInQueryService::findById($request, $id);
            $data = [
                'stockIn' => $stockIn
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateProduct
     */
    public function update(RequestApiStoreStockIn $request, $id)
    {
        try {
            StockInQueryService::update($request, $id);
            $data = [
                'stockIn' => StockInQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
