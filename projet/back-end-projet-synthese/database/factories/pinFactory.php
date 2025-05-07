<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\pin>
 */
class pinFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            
            "title"         => $this->faker->sentence ,
            "description"   => $this->faker->paragraph,
            "image_url"     => 'pin_imgs/default.png',
            "is_public"     => $this->faker->boolean(),
            "user_id"       => User::factory(),
        ];
    }
}
