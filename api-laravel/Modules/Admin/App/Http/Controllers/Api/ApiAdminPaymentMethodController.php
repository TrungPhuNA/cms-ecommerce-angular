<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Common\Query\PaymentMethodQueryService;
use Modules\Common\Query\PermissionQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminPaymentMethodController extends Controller
{
    /**
     * AdmGetListPayments
     */
    public function index(Request $request)
    {
        try {
            $paginator = PaymentMethodQueryService::getAll($request);
            $payments = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'       => $meta,
                'payments' => $payments
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmCreatePayments
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $payment = PaymentMethodQueryService::create($request);
            $data = [
                'payment' => $payment
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmShowPermission
     */
    public function show(Request $request, $id)
    {
        try {
            $payment = PaymentMethodQueryService::findById($request, $id);
            $data = [
                'payment' => $payment
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    /**
     * AdmUpdatePermission
     */
    public function update(Request $request, $id)
    {
        try {
            PaymentMethodQueryService::update($request, $id);
            $data = [
                'payment' => PaymentMethodQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
