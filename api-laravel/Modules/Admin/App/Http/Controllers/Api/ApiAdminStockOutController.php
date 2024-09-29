<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreStockOut;
use Modules\Common\Query\StockOutQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminStockOutController extends Controller
{
    /**
     * AdmGetListProduct
     */
    public function index(Request $request)
    {
        try {
            $paginator = StockOutQueryService::getAll($request);
            $stockOuts = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'      => $meta,
                'stockOuts' => $stockOuts
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
    public function store(RequestApiStoreStockOut $request): \Illuminate\Http\JsonResponse
    {
        try {
            $stockOut = StockOutQueryService::create($request);
            $data = [
                'stockOut' => $stockOut
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
            $stockOut = StockOutQueryService::findById($request, $id);
            $data = [
                'stockOut' => $stockOut
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
    public function update(RequestApiStoreStockOut $request, $id)
    {
        try {
            StockOutQueryService::update($request, $id);
            $data = [
                'stockOut' => StockOutQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
