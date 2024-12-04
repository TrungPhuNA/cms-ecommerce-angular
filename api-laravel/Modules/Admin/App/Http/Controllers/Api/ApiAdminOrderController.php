<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\OrderQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiAdminOrderController extends Controller
{
    /**
     * AdmGetListOrders
     */
    public function index(Request $request)
    {
        try {
            $paginator = OrderQueryService::getAll($request);
            $orders = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'orders' => $orders
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function generateQRCode(Request $request, $id)
    {

        try {
            // Lấy thông tin chi tiết đơn từ cơ sở dữ liệu
            $order = OrderQueryService::findById($request, $id); // Giả sử có model Order

            if (!$order) {
                return  ResponseService::sendError("Không tìm thấy đơn hàng");

            }
            $fileName = 'uploads/order_' . $order->code . '.png';
            $filePath = storage_path('app/public/' . $fileName);

//            QrCode::format('png')->size(300)->generate(json_encode($order), $filePath);
            return  ResponseService::sendSuccess(asset('storage/' . $fileName));
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }

    }

    /**
     * AdmCreateOrder
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
        try {
            $order = OrderQueryService::create($request);
            $data = [
                'order' => $order
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
            $order = OrderQueryService::findById($request, $id);
            $data = [
                'order' => $order
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
    public function update(Request $request, $id)
    {
        try {
            OrderQueryService::update($request, $id);
            $data = [
                'order' => OrderQueryService::findById($request, $id)
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }

    public function updateColumnOrder(Request $request, $id)
    {
        try{
            $orderUpdate = OrderQueryService::updateColumnOrder($request, $id);
            $data = [
                'order' => $orderUpdate
            ];
            return ResponseService::sendSuccess($data);
        }catch (\Exception $exception){
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
