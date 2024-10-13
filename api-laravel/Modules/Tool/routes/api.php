<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use Modules\Tool\App\Http\Controllers\Api\ApiToolExportProductController;
use Modules\Tool\App\Http\Controllers\Api\ApiToolImportProductController;

/*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register API routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | is assigned the "api" middleware group. Enjoy building your API!
    |
*/

Route::middleware(['auth:sanctum'])->prefix('v1')->name('api.')->group(function () {
    Route::prefix('tool')->group(function (){
        Route::prefix('export')->group(function (){
            Route::post('products',[ApiToolExportProductController::class,'exportProduct']);
        });
        Route::prefix('import')->group(function (){
            Route::post('products',[ApiToolImportProductController::class,'importProduct']);
        });
    });
});
