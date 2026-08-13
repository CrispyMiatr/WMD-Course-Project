<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Sighting extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'latitude',
        'longitude',
        'location_name',
        'type',
        'short_description',
        'details',
        'track_id',
    ];

    protected function casts(): array
    {
        return [
            'latitude' => 'float',
            'longitude' => 'float',
            'details' => 'array', // JSONB conversion
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}