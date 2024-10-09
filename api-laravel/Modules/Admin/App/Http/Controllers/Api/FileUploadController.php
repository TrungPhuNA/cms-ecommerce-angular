<?php

namespace Modules\Admin\App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Modules\Common\Service\ErrorLogService;
use Modules\Common\Service\ResponseService;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
       try {
           // Validate the incoming request with file requirements
           $request->validate([
               'file' => 'required|file|mimes:jpg,jpeg,png,pdf', // Adjust the file types and size as needed
           ]);

           // Store the file in the public/uploads directory
           if ($file = $request->file('file')) {
               $filePath = $file->store('uploads', 'public');
               // Return success response with the file path
               return ResponseService::sendSuccess([
                   "file_name" => $filePath
               ]);
           }

           // Return error response if the file is not present
           return ResponseService::sendError("Upload file failed!");
       } catch (\Exception $exception) {
           $message = ErrorLogService::logException($request->route()->getName(), $exception);
           return ResponseService::sendError($message);
       }
    }

    public function getFile(Request $request, $id)
    {
        try {
            $path = storage_path('app/public/uploads/' . $id);

            if (!file_exists($path)) {
                return response()->json(['error' => 'File not found.'], 404);
            }


            $file = Storage::disk('public')->get('uploads/' . $id);
            $type = Storage::disk('public')->mimeType('uploads/' . $id);
            return response($file, 200)->header('Content-Type', $type);
        } catch (\Exception $exception) {
            $message = ErrorLogService::logException($request->route()->getName(), $exception);
            return ResponseService::sendError($message);
        }
    }
}
