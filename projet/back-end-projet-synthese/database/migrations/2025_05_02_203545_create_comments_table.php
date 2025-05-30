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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->timestamps();

            $table->unsignedBigInteger('user_id');      
            $table->unsignedBigInteger('pin_id'); 

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('pin_id')->references('id')->on('pins')->onDelete('cascade');

            $table->index('user_id');
            $table->index('pin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
