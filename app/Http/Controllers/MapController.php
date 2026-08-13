<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use \App\Models\Sighting;

class MapController extends Controller
{
    public function index()
    {
        $sightings = Sighting::with('user:id,name,username')->latest()->get();

        $recentTracks = Sighting::where('created_at', '>=', now()->subHours(48))
            ->whereNotNull('track_id')
            ->orderBy('created_at', 'desc')
            ->get()
            ->unique('track_id');

        return Inertia::render('Map', [
            'sightings' => $sightings,
            'recentTracks' => $recentTracks,
        ]);
    }
}
