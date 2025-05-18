<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthUserController;
use App\Http\Controllers\PinController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Middleware\RejectAuthenticatedSanctum;

// Public routes -----

Route::post('user/logout', [AuthUserController::class, 'logout']);

Route::apiResource('user', UserController::class)->only(['show']);
Route::apiResource('pin', PinController::class)->only(['index' , 'show']);
Route::apiResource('comment', CommentController::class)->only(['index' , 'show']);
// Route::get('comment/{id}' , [CommentController::class , 'show'] ) ;
Route::apiResource('like', LikeController::class)->only(['index']);

// Protected routes -----

Route::middleware(['auth:sanctum'])->group(function () {
    
    Route::apiResource('user', UserController::class)->except(['show' , 'store']);
    Route::apiResource('pin', PinController::class)->except(['index' , 'show']);
    Route::apiResource('comment', CommentController::class)->except(['index' , 'show' ]);
    Route::apiResource('like', LikeController::class)->except(['index']);
});

// reject authonfification more then one time

Route::middleware(RejectAuthenticatedSanctum::class)->group(function () { //reject authonfification again
    Route::post('user/login', [AuthUserController::class, 'login']);
    Route::post('/user', [UserController::class, 'store']);
});
