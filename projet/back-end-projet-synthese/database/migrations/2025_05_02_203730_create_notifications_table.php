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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id('id'); // Use UUIDs for global uniqueness
            $table->string('type');                         // e.g., 'like', 'comment'
            $table->string('content');                           // Optional payload (e.g., message or metadata)
            $table->timestamp('read_at')->nullable();       // Mark as read
            $table->timestamps();                           // created_at & updated_at
            
            $table->unsignedBigInteger('user_id');        // Notification receiver
            $table->unsignedBigInteger('actor_id')->nullable(); // The user who triggered the action
            $table->unsignedBigInteger('pin_id')->nullable();   // The related pin (if any)

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('actor_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('pin_id')->references('id')->on('pins')->onDelete('cascade');

            // Indexes for performance
            $table->index('user_id');
            $table->index('actor_id');
            $table->index('pin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
