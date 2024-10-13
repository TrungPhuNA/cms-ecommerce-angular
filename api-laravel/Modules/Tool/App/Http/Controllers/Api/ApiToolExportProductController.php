<?php

namespace Modules\Tool\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\Export\JobExportProducts;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Modules\Common\Service\ResponseService;

class ApiToolExportProductController extends Controller
{
    /**
     * ApiToolExportProduct
     */
   public function exportProduct(Request $request)
   {
       try{
           $columns = $request->input('columns', []);
           // Kiểm tra nếu không có cột nào được chọn
           if (empty($columns)) {
               return ResponseService::sendError("No columns selected for export");
           }

           // Lấy email người dùng hiện tại
           $email = "codethue94@gmail.com";

           // Dispatch Job
           JobExportProducts::dispatch($columns, $email);

           return ResponseService::sendSuccess([],"Export started. You will receive an email when it is completed.");
       }catch (\Exception $exception) {
           return ResponseService::sendError($exception->getMessage());
       }
   }
}
