<?php

use Illuminate\Support\Facades\Route;
use Modules\Admin\App\Http\Controllers\AdminController;
use Modules\Admin\App\Http\Controllers\AdminCategoryController;
use Modules\Admin\App\Http\Controllers\AdminAttributeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::group([], function () {
    Route::resource('admin', AdminController::class)->names('admin');
    Route::group(['prefix' => 'admin','as' => 'admin.'], function (){
        Route::group(['prefix' => 'ecommerce','as' => 'category.'], function (){
            Route::resource('categories', AdminCategoryController::class)->names([
                'index' => 'index',
                'create' => 'create',
                'store' => 'store',
                'show' => 'show',
                'edit' => 'edit',
                'update' => 'update',
                'destroy' => 'destroy',
            ]);
        });
        Route::group(['prefix' => 'ecommerce','as' => 'attributes.'], function (){
            Route::resource('attributes', AdminAttributeController::class)->names([
                'index' => 'index',
                'create' => 'create',
                'store' => 'store',
                'show' => 'show',
                'edit' => 'edit',
                'update' => 'update',
                'destroy' => 'destroy',
            ]);
        });
    });
});
