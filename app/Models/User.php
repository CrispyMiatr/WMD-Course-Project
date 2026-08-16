<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'username', 'email', 'password', 'home_latitude', 'home_longitude', 'radius_km'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'home_latitude' => 'float',
            'home_longitude' => 'float',
            'radius_km' => 'integer',
        ];
    }

    protected $appends = ['rank'];

    public function sightings()
    {
        return $this->hasMany(Sighting::class);
    }

    /**
     * Determine the user's rank based on activity in the last 7 days
     */
    public function getRankAttribute(): array
    {
        $count = $this->sightings()->where('created_at', '>=', now()->subWeek())->count();

        if ($count >= 15) {
            return ['label' => 'Very Observant', 'level' => 'expert', 'color' => '#7946d0']; // purple
        } elseif ($count >= 5) {
            return ['label' => 'Active Observer', 'level' => 'intermediate', 'color' => '#3F88C5']; // blue
        } elseif ($count >= 1) {
            return ['label' => 'New Contributor', 'level' => 'newbie', 'color' => '#60935D']; // green
        }

        return ['label' => 'Inactive', 'level' => 'inactive', 'color' => '#797979']; // grey
    }

    public function getNeighborhoodStats()
    {
        if (!$this->home_latitude || !$this->home_longitude) {
            return null;
        }

        $latitude = $this->home_latitude;
        $longitude = $this->home_longitude;
        $radius = $this->radius_km;

        // Haversine formula
        $formula = "( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) )";

        /**
         * Spatial haversine query
         * Finds sightings within the user's specific radius
         */
        $count = Sighting::where('created_at', '>=', now()->subHours(48))
            ->whereRaw("$formula <= ?", [
                $latitude,
                $longitude,
                $latitude,
                $radius
            ])
            ->count();

        // Determine status based on local proximity
        $level = 'Low';
        $theme = 'success';

        if ($count > 8) {
            $level = 'Critical';
            $theme = 'danger';
        } elseif ($count > 2) {
            $level = 'Elevated';
            $theme = 'warning';
        }

        return [
            'recent' => $count,
            'threatLevel' => $level,
            'uiTheme' => $theme,
            'radius' => $radius
        ];
    }
}
