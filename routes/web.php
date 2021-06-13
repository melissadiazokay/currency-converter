<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ConvertController;

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


Route::get('/', [ HomeController::class, 'index' ]);

Route::post('/create', [ ConvertController::class, 'create' ]);

Route::get('/delete/{id}', [ ConvertController::class, 'delete' ]);
