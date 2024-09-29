<?php

namespace Modules\User\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Common\Query\BankQueryService;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class ApiUserBankController extends Controller
{
    /**
     * List Banks
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $paginator = BankQueryService::getAll($request);
            $banks = $paginator->getCollection();

            $meta = [
                "total"        => $paginator->total(),
                "per_page"     => (int) $paginator->perPage(),
                "current_page" => $paginator->currentPage(),
                "last_page"    => $paginator->lastPage()
            ];

            $data = [
                'meta'  => $meta,
                'banks' => $banks
            ];
            return ResponseService::sendSuccess($data);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
