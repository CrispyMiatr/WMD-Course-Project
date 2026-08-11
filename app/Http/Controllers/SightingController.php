<?php

namespace App\Http\Controllers;

use App\Models\Sighting;
use App\Http\Requests\StoreSightingRequest;
use Illuminate\Http\RedirectResponse;

class SightingController extends Controller
{
    public function store(StoreSightingRequest $request): RedirectResponse
    {
        Sighting::create([
            'user_id' => auth()->id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'type' => $request->type,
            'short_description' => $request->short_description,
            'details' => $request->details,
        ]);

        return redirect()->back(); // Will automatically update page props
    }
}