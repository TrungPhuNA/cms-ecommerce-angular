<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreStockOut;
use Modules\Common\Query\AgencyQueryService;
use Modules\Common\Query\OrderQueryService;
use Modules\Common\Query\StockOutQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminAgencyController extends Controller
{
    /**
     * AdmGetListProduct
     */
    public function index(Request $request)
    {
        try {
            $paginator = AgencyQueryService::getAll($request);
            $stockOuts = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'      => $meta,
                'agencies' => $stockOuts
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
    public function store(Request $request)
    {
        try {
            $input = $request->all();
            $stockOut = AgencyQueryService::create($input);
            $data = [
                'agency' => $stockOut
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }

    /**
     * AdmShowCategory
     */
    public function show(Request $request, $id)
    {
        try {
            $stockOut = AgencyQueryService::findById($request, $id);
            $data = [
                'agency' => $stockOut
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
    public function update(Request $request, $id)
    {
        try {
            AgencyQueryService::update($request->all(), $id);
            $data = [
                'agency' => AgencyQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function delete(Request $request, $id)
    {
        try {
            AgencyQueryService::deleteById($request, $id);
            return ResponseService::sendSuccess(null);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
