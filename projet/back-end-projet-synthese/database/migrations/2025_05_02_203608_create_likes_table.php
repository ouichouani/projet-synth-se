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
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->unsignedBigInteger('user_id') ;
            $table->unsignedBigInteger('pin_id') ;

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pin_id')->references('id')->on('pins')->onDelete('cascade');

            $table->unique(['user_id', 'pin_id']);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('likes');
    }
};
