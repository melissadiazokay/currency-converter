<?php

use App\Http\Controllers\ConvertController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\VueController;
use Illuminate\Support\Facades\Route;


// API routes
Route::get('/conversions/{email}', [ ConvertController::class, 'fetch' ]);
Route::post('/save-conversion', [ ConvertController::class, 'create' ]);
Route::get('/delete-conversion/{id}', [ ConvertController::class, 'delete' ]);

// wildcard route for Vue js
Route::get('/{wildcard?}', [ VueController::class, 'index' ])->where('wildcard', '(.*)')->name('app');