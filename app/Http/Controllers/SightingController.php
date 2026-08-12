<?php

namespace App\Http\Controllers;

use App\Models\Sighting;
use App\Http\Requests\StoreSightingRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Http;

class SightingController extends Controller
{
    public function store(StoreSightingRequest $request): RedirectResponse
    {
        $locationName = 'Unknown Area';

        try {
            $response = Http::withHeaders(['User-Agent' => 'WatchLog-Course-Project'])
                ->get("https://nominatim.openstreetmap.org/reverse", [
                    'format' => 'json',
                    'lat' => $request->latitude,
                    'lon' => $request->longitude,
                    'zoom' => 14, //city/municipality level
                ]);

            if ($response->successful()) {
                $address = $response->json()['address'] ?? [];
                // Try to find best name (city, town, village, or municipality)
                $locationName = $address['city']
                    ?? $address['town']
                    ?? $address['village']
                    ?? $address['municipality']
                    ?? 'Unknown Area';
            }
        } catch (\Exception $e) {
            // Fallback if API is down
        }

        Sighting::create([
            'user_id' => auth()->id(),
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'location_name' => $locationName,
            'type' => $request->type,
            'short_description' => $request->short_description,
            'details' => $request->details,
        ]);

        return redirect()->back();
    }
}