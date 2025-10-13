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
            // Additional 7 items with mixed units
            [
                'name' => 'Complete Fertilizer (14-14-14)',
                'type' => 'fertilizer',
                'description' => 'Balanced NPK fertilizer suitable for various crops and growth stages.',
                'base_unit' => 'kg',
                'price_per_unit' => 32.25,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Liquid Organic Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Natural organic fertilizer in liquid form for easy application.',
                'base_unit' => 'liter',
                'price_per_unit' => 45.80,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Powdered Insecticide',
                'type' => 'pesticide',
                'description' => 'Water-soluble powdered insecticide for controlling various pests.',
                'base_unit' => 'kg',
                'price_per_unit' => 75.50,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Liquid Potassium Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Water-soluble potassium fertilizer in liquid concentrate form.',
                'base_unit' => 'liter',
                'price_per_unit' => 52.00,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Granular Fungicide',
                'type' => 'pesticide',
                'description' => 'Granular fungicide for soil application to prevent fungal diseases.',
                'base_unit' => 'kg',
                'price_per_unit' => 88.75,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Liquid Calcium Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Liquid calcium supplement for plants, prevents blossom end rot.',
                'base_unit' => 'liter',
                'price_per_unit' => 38.90,
                'status' => 'archived',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Concentrated Neem Oil',
                'type' => 'pesticide',
                'description' => 'Organic insecticide concentrate derived from neem seeds.',
                'base_unit' => 'liter',
                'price_per_unit' => 95.25,
                'status' => 'active',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ]);
    }
}