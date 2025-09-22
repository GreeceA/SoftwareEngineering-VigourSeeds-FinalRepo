<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ItemSeeder extends Seeder
{
    public function run()
    {
        DB::table('items')->insert([
            [
                'name' => 'Urea Fertilizer',
                'type' => 'fertilizer',
                'description' => 'A nitrogen-rich fertilizer commonly used to promote plant growth.',
                'base_unit' => 'kg',
                'price_per_unit' => 25.50,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Glyphosate Herbicide',
                'type' => 'pesticide',
                'description' => 'A broad-spectrum systemic herbicide used to kill weeds.',
                'base_unit' => 'liter',
                'price_per_unit' => 120.00,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Ammonium Sulfate',
                'type' => 'fertilizer',
                'description' => 'Provides nitrogen and sulfur nutrients for soil enrichment.',
                'base_unit' => 'kg',
                'price_per_unit' => 18.75,
                'status' => 'archived',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}
