<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('units', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('property_id')->unsigned();
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            $table->string('unit_number')->unique();
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->decimal('rent_amount', 10, 2);
            $table->integer('floor')->nullable();
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->boolean('is_furnished')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('units');
    }
};
