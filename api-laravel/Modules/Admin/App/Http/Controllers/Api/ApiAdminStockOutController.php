<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreStockOut;
use Modules\Common\Query\OrderQueryService;
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
     * AdmGetListProduct
     */
    public function getListStockOut(Request $request)
    {
        try {
            $paginator = StockOutQueryService::getAllStockOutV2($request);
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
    public function storeStockOut(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $input = $request->all();
            DB::beginTransaction();
            $stockOut = StockOutQueryService::storeData($input);
            $data = [
                'stockOut' => $stockOut
            ];
            DB::commit();
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            DB::rollBack();
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
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
