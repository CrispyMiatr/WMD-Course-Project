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

        // 1. Define the sets clearly
        $personMicrolabels = ['suspicious_person', 'loitering_youth', 'trespassing'];

        // Create the base query
        $query = Sighting::query()->with('user:id,name,username');

        // 2. Handle Search
        if ($request->filled('search')) {
            $query->where('short_description', 'ilike', '%' . $request->search . '%');
        }

        // 3. Handle Filtering (The Fix)
        if ($request->filled('type') && $request->type !== 'all') {
            if ($request->type === 'person') {
                // "All People" selected
                $query->whereIn('type', $personMicrolabels);
            } elseif ($request->type === 'other') {
                // "All Objects" selected (everything NOT in the person list)
                $query->whereNotIn('type', $personMicrolabels);
            } else {
                // Specific microlabel selected (e.g., 'vandalism')
                $query->where('type', $request->type);
            }
        }

        // 4. Calculate Stats (Use separate queries to avoid filter interference)
        $baseStats = [
            'total' => Sighting::count(),
            'people' => Sighting::whereIn('type', $personMicrolabels)->count(),
            'objects' => Sighting::whereNotIn('type', $personMicrolabels)->count(),
        ];

        // 5. Neighborhood/Personalized Stats
        if ($user && $user->home_latitude && $user->home_longitude) {
            $statsData = $user->getNeighborhoodStats();
            $stats = array_merge($baseStats, [
                'recent' => $statsData['recent'],
                'threatLevel' => $statsData['threatLevel'],
                'uiTheme' => $statsData['uiTheme'],
                'radius' => $statsData['radius'],
                'is_personalized' => true,
            ]);
        } else {
            $recentCount = Sighting::where('created_at', '>=', now()->subHours(48))->count();
            $stats = array_merge($baseStats, [
                'recent' => $recentCount,
                'threatLevel' => $recentCount > 15 ? 'Critical' : ($recentCount > 5 ? 'Elevated' : 'Low'),
                'uiTheme' => $recentCount > 15 ? 'danger' : ($recentCount > 5 ? 'warning' : 'success'),
                'is_personalized' => false
            ]);
        }

        // 6. Insights Query (Grouped by age and type)
        $insights = \DB::table('sightings')
            ->join('users', 'sightings.user_id', '=', 'users.id')
            ->select([
                \DB::raw("CASE 
                WHEN (2024 - users.birth_year) < 25 THEN 'Gen Z / Youth'
                WHEN (2024 - users.birth_year) BETWEEN 25 AND 45 THEN 'Millennials / Adults'
                WHEN (2024 - users.birth_year) > 45 THEN 'Seniors'
                ELSE 'Unknown'
            END as age_group"),
                'sightings.type',
                \DB::raw('count(*) as count')
            ])
            ->whereNotNull('users.birth_year')
            ->groupBy('age_group', 'sightings.type')
            ->orderBy('count', 'desc')
            ->get()
            ->groupBy('age_group');

        return Inertia::render('Overview', [
            'sightings' => $query->latest()->paginate(10)->withQueryString(),
            'stats' => $stats,
            'filters' => $request->only(['search', 'type']),
            'insights' => $insights
        ]);
    }
}