<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\SlideQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminSlideController extends Controller
{
    /**
     * AdmGetListSlide
     */
    public function index(Request $request)
    {
        try {
            $paginator = SlideQueryService::getAll($request);
            $slides = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'slides' => $slides
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
            $slide = SlideQueryService::create($request);
            $data = [
                'slide' => $slide
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
            $slide = SlideQueryService::findById($request, $id);
            $data = [
                'slide' => $slide
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
    public function update(Request $request, $id)
    {
        try {
            SlideQueryService::update($request, $id);
            $data = [
                'slide' => SlideQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
