<?php
/**
 * Created By PhpStorm
 * Code By : trungphuna
 * Date: 7/18/24
 */

namespace Modules\Common\Service;

use Illuminate\Support\Facades\Log;

class ErrorLogService
{
    public static function logException($apiName, $exception, $dataRequest = [])
    {
        $message = "== [API][ERROR] == " . $apiName;

        $message .= " | Code: " . $exception->getCode();

        $message .= " | Line: " . $exception->getLine();

        $message .= " | File: " . $exception->getFile();

        $message .= " | " . $exception->getMessage();

        $message .= " | Request: " . json_encode($dataRequest);

        Log::error($message);

        if (config("app.env") == "production") {
            $message = "System Errors!";
        }

        return $message;
    }
}