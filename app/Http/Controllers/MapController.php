<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use \App\Models\Sighting;

class MapController extends Controller
{
    public function index()
    {
        $sightings = Sighting::with('user:id,name')->latest()->get();

        return Inertia::render('Map', [
            'status' => 'Map View Active',
            'sightings' => $sightings
        ]);
    }
}
