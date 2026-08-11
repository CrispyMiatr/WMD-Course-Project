<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\MapController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SightingController;

use \Illuminate\Support\Facades\Auth;

// Temporary login bypass
Route::get('/dev-login', function () {
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'test@watchlog.com'],
        [
            'name' => 'Test User',
            'password' => bcrypt('password')
        ]
    );

    Auth::login($user);

    return redirect()->route('map.index');
});

// Homepage
Route::get('/', [HomeController::class, 'index'])->name('home');

// Map
Route::get('/map', [MapController::class, 'index'])->name('map.index');

// Auth
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::post('/sightings', [SightingController::class, 'store'])->name('sightings.store');
});

require __DIR__ . '/auth.php';
