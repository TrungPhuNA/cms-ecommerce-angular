<?php

namespace Modules\Tool\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Imports\JobImportProducts;
use App\Jobs\Export\JobExportProducts;
use Illuminate\Http\Request;
use Modules\Common\Service\ResponseService;
use Maatwebsite\Excel\Facades\Excel;

class ApiToolImportProductController extends Controller
{
    /**
     * ApiToolImportProduct
     */
    public function importProduct(Request $request)
    {
        try{
            $request->validate([
                'file' => 'required|mimes:csv,xlsx',
            ]);

            Excel::import(new JobImportProducts(), $request->file('file'));

            return ResponseService::sendSuccess([],"Products imported successfully.");
        }catch (\Exception $exception) {
            return ResponseService::sendError($exception->getMessage());
        }
    }
}
