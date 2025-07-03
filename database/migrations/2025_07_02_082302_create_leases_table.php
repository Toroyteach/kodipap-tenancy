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
        Schema::create('leases', function (Blueprint $table) {
            $table->increments('id');

            $table->integer('user_id')->unsigned();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            $table->integer('unit_id')->unsigned();
            $table->foreign('unit_id')->references('id')->on('units')->onDelete('cascade');

            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->decimal('rent_amount', 10, 2);
            $table->decimal('deposit_amount', 10, 2)->default(0);
            $table->enum('status', ['active', 'terminated', 'pending', 'overdue'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leases');
    }
};
