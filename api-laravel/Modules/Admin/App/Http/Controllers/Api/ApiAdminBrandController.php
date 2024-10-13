<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreCategory;
use Modules\Common\Query\BrandQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminBrandController extends Controller
{
    /**
     * AdmGetListBrand
     */
    public function index(Request $request)
    {
        try {
            $paginator = BrandQueryService::getAll($request);
            $brands = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'brands' => $brands
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateBrand
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $brand = BrandQueryService::create($request);
            $data = [
                'brand' => $brand
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowBrand
     */
    public function show(Request $request, $id)
    {
        try {
            $brand = BrandQueryService::findById($request, $id);
            $data = [
                'brand' => $brand
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateBrand
     */
    public function update(RequestApiStoreCategory $request, $id)
    {
        try {
            BrandQueryService::update($request, $id);
            $data = [
                'brand' => BrandQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
