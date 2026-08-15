<?php

namespace App\Http\Controllers;

use App\Models\Sighting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OverviewController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Filtering + searching
        $query = Sighting::query()->with('user:id,name,username');

        if ($request->search) {
            $query->where('short_description', 'ilike', '%' . $request->search . '%');
        }

        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        $recentCount = Sighting::where('created_at', '>=', now()->subHours(48))->count();

        $threatLevel = 'Low';
        $uiTheme = 'success'; // Green

        if ($recentCount > 15) {
            $threatLevel = 'Critical';
            $uiTheme = 'danger'; // Red
        } elseif ($recentCount > 5) {
            $threatLevel = 'Elevated';
            $uiTheme = 'warning'; // Yellow
        }

        // Data aggregation for visuals -> personal vs global stats
        if ($user && $user->home_latitude && $user->home_longitude) {
            $statsData = $user->getNeighborhoodStats();

            $stats = [
                'total' => Sighting::count(),
                'people' => Sighting::where('type', 'person')->count(),
                'objects' => Sighting::where('type', 'other')->count(),
                'recent' => $statsData['recent'],
                'threatLevel' => $statsData['threatLevel'],
                'uiTheme' => $statsData['uiTheme'],
                'is_personalized' => true,
                'radius' => $statsData['radius']
            ];
        } else {
            // Fallback -> global stats
            $recentCount = Sighting::where('created_at', '>=', now()->subHours(48))->count();

            $threatLevel = 'Low';
            $uiTheme = 'success';
            if ($recentCount > 15) {
                $threatLevel = 'Critical';
                $uiTheme = 'danger';
            } elseif ($recentCount > 5) {
                $threatLevel = 'Elevated';
                $uiTheme = 'warning';
            }

            $stats = [
                'total' => Sighting::count(),
                'people' => Sighting::where('type', 'person')->count(),
                'objects' => Sighting::where('type', 'other')->count(),
                'recent' => $recentCount,
                'threatLevel' => $threatLevel,
                'uiTheme' => $uiTheme,
                'is_personalized' => false
            ];
        }

        return Inertia::render('Overview', [
            'sightings' => $query->latest()->paginate(10)->withQueryString(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'type']),
        ]);
    }
}