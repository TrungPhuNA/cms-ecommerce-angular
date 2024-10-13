<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminWalletController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminAuthController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminProfileController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminCategoryController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminProductController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminStockInController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminStockOutController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminUserController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminAttributeController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminAttributeValueController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminPermissionController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminRoleController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminProductOptionController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminOrderController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminDashboardController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminPaymentMethodController;
use Modules\Admin\App\Http\Controllers\Api\ApiAdminBrandController;
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

//Route::middleware(['auth:sanctum'])->prefix('v1')->name('api.')->group(function () {
//    Route::get('admin', fn (Request $request) => $request->user())->name('admin');
//});

Route::prefix('v1/admin')->name('api.')->group(function () {
    Route::post('auth/register',[ApiAdminAuthController::class,'register']);
    Route::post('auth/login',[ApiAdminAuthController::class,'login']);
});

Route::middleware(['auth:sanctum'])->prefix('v1')->name('api.')->group(function () {
    Route::prefix('admin')->group(function (){
        Route::get('me',[ApiAdminProfileController::class,'getProfile']);
        Route::put('me',[ApiAdminProfileController::class,'updateProfile']);

        Route::resource('wallet',ApiAdminWalletController::class)->except(["update","edit","delete","create","destroy","show"]);
        Route::post('wallet/withdraw-money',[ApiAdminWalletController::class,'withdrawMoney']);
        Route::get('wallet/history',[ApiAdminWalletController::class,'history']);
        Route::resource('account',ApiAdminUserController::class);

        Route::resource('attributes',ApiAdminAttributeController::class);
        Route::resource('attributes-value',ApiAdminAttributeValueController::class);
        Route::resource('product-options',ApiAdminProductOptionController::class);
        Route::resource('categories',ApiAdminCategoryController::class);
        Route::post('products/store-v2',[ApiAdminProductController::class,'storeV2']);
        Route::get('products/show-v2/{id}',[ApiAdminProductController::class,'showV2']);
        Route::resource('products',ApiAdminProductController::class);

        Route::put('orders/update-column/{id}',[ApiAdminOrderController::class,'updateColumnOrder']);
        Route::resource('orders',ApiAdminOrderController::class);

        Route::resource('stock-in',ApiAdminStockInController::class);
        Route::resource('stock-out',ApiAdminStockOutController::class);

        Route::resource('permissions',ApiAdminPermissionController::class);
        Route::resource('roles',ApiAdminRoleController::class);
        Route::get('dashboard',[ApiAdminDashboardController::class,'getDashboard']);
        Route::resource('payments-method',ApiAdminPaymentMethodController::class);

        Route::resource('brands',ApiAdminBrandController::class);
    });
});

Route::prefix('v1/uploads')->name('api.')->group(function () {
    Route::post('',[\Modules\Admin\App\Http\Controllers\Api\FileUploadController::class,'upload']);
    Route::get('/{id}',[\Modules\Admin\App\Http\Controllers\Api\FileUploadController::class,'getFile']);
});
