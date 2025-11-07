<?php

use App\Http\Controllers\PurchaseController;
use Illuminate\Support\Facades\Route;

Route::middleware(['jwt.verify'])->group(function () {
    
    Route::get('events', [PurchaseController::class, 'indexEvents']);

    Route::post('purchases', [PurchaseController::class, 'store']);

    Route::post('purchases/{purchase}/pay', [PurchaseController::class, 'pay']); 
});