<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\User\App\Http\Controllers\Api\ApiUserProfileController;
use Modules\User\App\Http\Controllers\Api\ApiAuthUserController;
use Modules\User\App\Http\Controllers\Api\ApiUserBankController;
use Modules\User\App\Http\Controllers\Api\ApiUserBankAccountController;

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

Route::prefix('v1')->name('api.')->group(function () {
    Route::post('auth/register',[ApiAuthUserController::class,'register']);
    Route::post('auth/login',[ApiAuthUserController::class,'login']);
});
Route::middleware(['auth:sanctum'])->prefix('v1')->name('api.')->group(function () {
    Route::prefix('user')->group(function (){
        Route::resource('bank-account',ApiUserBankAccountController::class)->except('edit','create');
        Route::put('',[ApiUserProfileController::class,'updateProfile']);
        Route::get('me',[ApiUserProfileController::class,'getProfile']);
    });
    Route::resource('user',ApiUserProfileController::class)->only(['index']);
    Route::resource('banks',ApiUserBankController::class)->only(['index']);
});
