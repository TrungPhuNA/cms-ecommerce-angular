<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Admin\App\Http\Requests\Api\RequestApiStoreCategory;
use Modules\Common\Query\CategoryQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminCategoryController extends Controller
{
    /**
     * AdmGetListCategory
     */
    public function index(Request $request)
    {
        try {
            $paginator = CategoryQueryService::getAll($request);
            $categories = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'categories' => $categories
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreateCategory
     */
    public function store(RequestApiStoreCategory $request): \Illuminate\Http\JsonResponse
    {
        try {
            $category = CategoryQueryService::create($request);
            $data = [
                'category' => $category
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
            $category = CategoryQueryService::findById($request, $id);
            $data = [
                'category' => $category
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdateCategory
     */
    public function update(RequestApiStoreCategory $request, $id)
    {
        try {
            CategoryQueryService::update($request, $id);
            $data = [
                'category' => CategoryQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        //
    }
}
