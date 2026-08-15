<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->decimal('home_latitude', 10, 8)->nullable();
            $table->decimal('home_longitude', 11, 8)->nullable();
            $table->integer('radius_km')->default(5); // Default 5km radius
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['home_latitude', 'home_longitude', 'radius_km']);
        });
    }
};
