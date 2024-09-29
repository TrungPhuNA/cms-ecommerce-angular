<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Service;

use Illuminate\Support\Facades\Response;

class ResponseService
{
    public static function sendError($message, $option = [])
    {
        return Response::json([
            'status'     => data_get($option, "status", "error"),
            'error_code' => data_get($option, "error_code", 1),
            'message'    => $message,
            'data'       => data_get($option, "data", [])
        ], data_get($option, "status_code", 500));
    }

    public static function sendSuccess($data = [], string $message = "successfully")
    {
        return Response::json([
            'status'     => AppStatusCodeService::SUCCESS_CODE,
            'error_code' => 0,
            'message'    => $message,
            'data'       => $data
        ], 200);
    }
}