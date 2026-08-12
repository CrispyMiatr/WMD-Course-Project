<?php

namespace App\Http\Controllers;

use App\Models\Sighting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OverviewController extends Controller
{
    public function index(Request $request)
    {
        // Filtering + searching
        $query = Sighting::query()->with('user:id,name,username');

        if ($request->search) {
            $query->where('short_description', 'ilike', '%' . $request->search . '%');
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        // Data aggregation for visuals
        $stats = [
            'total' => Sighting::count(),
            'people' => Sighting::where('type', 'person')->count(),
            'objects' => Sighting::where('type', 'other')->count(),
        ];

        return Inertia::render('Overview', [
            'sightings' => $query->latest()->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'type']),
            'stats' => $stats,
        ]);
    }
}