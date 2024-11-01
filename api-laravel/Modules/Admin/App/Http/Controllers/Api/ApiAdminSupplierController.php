<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\SupplierQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminSupplierController extends Controller
{
    /**
     * AdmGetListSlide
     */
    public function index(Request $request)
    {
        try {
            $paginator = SupplierQueryService::getAll($request);
            $suppliers = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'suppliers' => $suppliers
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }

    /**
     * AdmCreateBrand
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $supplier = SupplierQueryService::create($request);
            $data = [
                'supplier' => $supplier
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }

    /**
     * AdmShowBrand
     */
    public function show(Request $request, $id)
    {
        try {
            $supplier= SupplierQueryService::findById($request, $id);
            $data = [
                'supplier' => $supplier
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }

    /**
     * AdmUpdateBrand
     */
    public function update(Request $request, $id)
    {
        try {
            SupplierQueryService::update($request, $id);
            $data = [
                'supplier' => SupplierQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }


    public function deleteById(Request $request, $id)
    {
        try {
            SupplierQueryService::deleteById($request, $id);
            $data = [
                'supplier' => null
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($exception->getMessage());
        }
    }
}
