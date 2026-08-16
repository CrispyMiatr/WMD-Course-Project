<?php

namespace Database\Factories;

use App\Models\Sighting;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class SightingFactory extends Factory
{
    protected $model = Sighting::class;

    public function definition(): array
    {
        $scenarios = [
            'suspicious_person' => [
                'descriptions' => ['Person checking car door handles', 'Individual peering into ground-floor windows', 'Person following delivery trucks'],
                'entity_type' => 'Person',
                'details' => fn() => [
                    'clothing' => fake()->safeColorName() . ' ' . fake()->randomElement(['hoodie', 'jacket', 'coat']),
                    'observed_behavior' => fake()->randomElement(['running', 'loitering', 'taking photos']),
                    'estimated_age' => fake()->numberBetween(20, 50),
                ]
            ],
            'loitering_youth' => [
                'descriptions' => ['Group blocking the sidewalk', 'Loud gathering in the park after hours', 'Teenagers on mopeds near the alley'],
                'entity_type' => 'Person',
                'details' => fn() => [
                    'group_size' => fake()->numberBetween(3, 8),
                    'noise_level' => fake()->randomElement(['moderate', 'high', 'disturbing']),
                    'activity' => fake()->randomElement(['skating', 'smoking', 'shouting']),
                ]
            ],
            'trespassing' => [
                'descriptions' => ['Unauthorized person in back garden', 'Someone climbed the side fence', 'Person spotted in construction site'],
                'entity_type' => 'Person',
                'details' => fn() => [
                    'entry_point' => fake()->randomElement(['Back gate', 'Fence', 'Roof', 'Basement window']),
                    'direction_of_travel' => fake()->randomElement(['North', 'South', 'East', 'West']),
                ]
            ],
            'suspicious_vehicle' => [
                'descriptions' => ['Van idling for over an hour', 'Car driving slowly with lights off', 'Unknown vehicle parked in private driveway'],
                'entity_type' => 'Vehicle',
                'details' => fn() => [
                    'make' => fake()->randomElement(['BMW', 'Mercedes', 'Volkswagen', 'Ford']),
                    'color' => fake()->safeColorName(),
                    'license_plate' => strtoupper(fake()->bothify('#-???-###')),
                    'is_idling' => fake()->boolean(),
                ]
            ],
            'vandalism' => [
                'descriptions' => ['Graffiti on the community center', 'Smashed window at the corner shop', 'Park bench uprooted'],
                'entity_type' => 'Property',
                'details' => fn() => [
                    'damage_type' => fake()->randomElement(['Graffiti', 'Broken Glass', 'Arson attempt', 'Structural damage']),
                    'tool_used' => fake()->randomElement(['Spray paint', 'Hammer', 'Marker', 'Stone']),
                ]
            ],
            'theft_risk' => [
                'descriptions' => ['Unlocked bicycle left overnight', 'Garage door left wide open', 'Amazon packages visible from street'],
                'entity_type' => 'Unsecured Asset',
                'details' => fn() => [
                    'risk_level' => 'High',
                    'owner_notified' => fake()->boolean(),
                ]
            ],
            'other' => [
                'descriptions' => ['Illegal dumping of furniture', 'Strange smell coming from drain', 'Street light out causing safety concern'],
                'entity_type' => 'Environmental',
                'details' => fn() => [
                    'priority' => fake()->randomElement(['Low', 'Medium', 'High']),
                ]
            ]
        ];

        $type = fake()->randomElement(array_keys($scenarios));
        $scenario = $scenarios[$type];

        return [
            'user_id' => User::factory(),
            'latitude' => 50.842207 + (mt_rand(-300, 300) / 10000),
            'longitude' => 4.322723 + (mt_rand(-300, 300) / 10000),
            'location_name' => fake()->streetName() . ', ' . fake()->randomElement(['Brussels', 'Ixelles', 'Saint-Gilles']),
            'type' => $type,
            'short_description' => fake()->randomElement($scenario['descriptions']),
            // MERGE entity_type into the details JSON array
            'details' => array_merge(
                ['entity_type' => $scenario['entity_type']],
                $scenario['details']()
            ),
            'track_id' => null,
            'created_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ];
    }
}