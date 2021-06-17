<?php

use App\Http\Controllers\ConvertController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VueController;
use Illuminate\Support\Facades\Route;

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


// API routes
Route::get('/conversions/{email}', [ ConvertController::class, 'fetch' ]);
Route::post('/save-conversion', [ ConvertController::class, 'create' ]);
Route::get('/delete-conversion/{id}', [ ConvertController::class, 'delete' ]);

// web page routes 
Route::get('/test', [ HomeController::class, 'index' ])->name('test');

// wildcard route for Vue js
Route::get('/{wildcard?}', [ VueController::class, 'index' ])->where('wildcard', '(.*)')->name('app');