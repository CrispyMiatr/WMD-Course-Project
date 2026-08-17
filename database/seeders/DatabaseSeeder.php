<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Sighting;
use Illuminate\Support\Str;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Main Demo User
        $testUser = User::factory()->create([
            'name' => 'Demo User',
            'username' => 'demo.user',
            'email' => 'demo@user.com',
            'birth_year' => 1990,
            'home_latitude' => 50.842207,
            'home_longitude' => 4.322723,
            'radius_km' => 5
            // 'password' = password
        ]);

        // Demographic groups for "Insights" patterns
        $seniors = User::factory()->count(5)->create(['birth_year' => fake()->numberBetween(1950, 1965)]);
        $youth = User::factory()->count(5)->create(['birth_year' => fake()->numberBetween(1998, 2006)]);
        $others = User::factory()->count(10)->create();

        // Moving Track (a vehicle trajectory)
        $trackId = Str::uuid();
        $baseLat = 50.8450;
        $baseLng = 4.3250;

        for ($i = 0; $i < 6; $i++) {
            Sighting::create([
                'user_id' => $others->random()->id,
                'track_id' => $trackId,
                'type' => 'suspicious_vehicle',
                'location_name' => 'Avenue de la Toison d\'Or',
                'short_description' => 'Dark tinted sedan circling the luxury shops.',
                'latitude' => $baseLat + ($i * 0.0015),
                'longitude' => $baseLng + ($i * 0.0008),
                'details' => [
                    'entity_type' => 'Vehicle',
                    'color' => 'Black',
                    'make' => 'Audi',
                    'observation_index' => $i
                ],
                'created_at' => now()->subMinutes(120 - ($i * 15)),
            ]);
        }

        // "Hotspots" for the Heatmap & Insights
        // Senior demographic seeing Vandalism
        Sighting::factory()->count(12)->create([
            'user_id' => $seniors->random()->id,
            'type' => 'vandalism',
            'created_at' => now()->subDays(1)
        ]);

        // Youth demographic seeing Suspicious Persons
        Sighting::factory()->count(10)->create([
            'user_id' => $youth->random()->id,
            'type' => 'suspicious_person',
            'created_at' => now()->subHours(12)
        ]);

        // General "Noise" for the map
        Sighting::factory()->count(25)->create();

        // Demo User's personal logs (so the Profile page isn't empty)
        Sighting::factory()->count(4)->create([
            'user_id' => $testUser->id,
            'location_name' => 'Close to My Residence',
            'created_at' => now()->subHours(5)
        ]);
    }
}
