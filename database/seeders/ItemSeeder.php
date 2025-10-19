<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Clean up the table before seeding (Truncate and reset IDs safely)
        $this->cleanup();

        // Define the current timestamp
        $now = Carbon::now();

        // --- 2. Define the 30 items for insertion (15 Fertilizer, 15 Pesticide) ---
        // (25 Active, 5 Archived: 13 Active F + 2 Archived F | 12 Active P + 3 Archived P)
        
        $items = [
            // --- ACTIVE FERTILIZERS (13 Total) ---
            [
                'name' => 'Urea Fertilizer (46-0-0)',
                'type' => 'fertilizer',
                'description' => 'A nitrogen-rich fertilizer commonly used to promote plant growth.',
                'base_unit' => 'kg',
                'price_per_unit' => 25.50,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Complete Fertilizer (14-14-14)',
                'type' => 'fertilizer',
                'description' => 'Balanced NPK fertilizer suitable for various crops and growth stages.',
                'base_unit' => 'kg',
                'price_per_unit' => 32.25,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Liquid Organic Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Natural organic fertilizer in liquid form for easy application.',
                'base_unit' => 'liter',
                'price_per_unit' => 45.80,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Liquid Potassium Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Water-soluble potassium fertilizer in liquid concentrate form.',
                'base_unit' => 'liter',
                'price_per_unit' => 52.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'High Phosphate Bloom Booster',
                'type' => 'fertilizer',
                'description' => 'A high-phosphorus formula to encourage prolific flowering and fruiting.',
                'base_unit' => 'kg',
                'price_per_unit' => 65.90,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Calcium Nitrate Granules',
                'type' => 'fertilizer',
                'description' => 'Provides readily available calcium and nitrogen for soil application.',
                'base_unit' => 'kg',
                'price_per_unit' => 28.15,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Micronutrient Mix',
                'type' => 'fertilizer',
                'description' => 'A chelated mix of essential trace elements for correcting deficiencies.',
                'base_unit' => 'kg',
                'price_per_unit' => 98.40,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Seaweed Extract Concentrate',
                'type' => 'fertilizer',
                'description' => 'Natural growth stimulant rich in auxins, cytokinins, and gibberellins.',
                'base_unit' => 'liter',
                'price_per_unit' => 155.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Slow-Release Nitrogen Pellets',
                'type' => 'fertilizer',
                'description' => 'Coated nitrogen pellets for extended nutrient release over the growing season.',
                'base_unit' => 'kg',
                'price_per_unit' => 40.75,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Foliar Feed Concentrate',
                'type' => 'fertilizer',
                'description' => 'Concentrated solution for direct leaf application.',
                'base_unit' => 'liter',
                'price_per_unit' => 78.50,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Magnesium Sulfate (Epsom Salt)',
                'type' => 'fertilizer',
                'description' => 'A source of magnesium and sulfur, typically used for foliar feeding.',
                'base_unit' => 'kg',
                'price_per_unit' => 17.50,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Organic Compost Tea',
                'type' => 'fertilizer',
                'description' => 'Ready-to-use liquid solution packed with beneficial microbes.',
                'base_unit' => 'liter',
                'price_per_unit' => 60.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Zinc Micronutrient Spray',
                'type' => 'fertilizer',
                'description' => 'Liquid chelated zinc supplement for plants.',
                'base_unit' => 'liter',
                'price_per_unit' => 95.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // --- ACTIVE PESTICIDES (12 Total) ---
            [
                'name' => 'Glyphosate Herbicide',
                'type' => 'pesticide',
                'description' => 'A broad-spectrum systemic herbicide used to kill weeds.',
                'base_unit' => 'liter',
                'price_per_unit' => 120.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Powdered Insecticide',
                'type' => 'pesticide',
                'description' => 'Water-soluble powdered insecticide for controlling various pests.',
                'base_unit' => 'kg',
                'price_per_unit' => 75.50,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Granular Fungicide',
                'type' => 'pesticide',
                'description' => 'Granular fungicide for soil application to prevent fungal diseases.',
                'base_unit' => 'kg',
                'price_per_unit' => 88.75,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Concentrated Neem Oil',
                'type' => 'pesticide',
                'description' => 'Organic insecticide concentrate derived from neem seeds.',
                'base_unit' => 'liter',
                'price_per_unit' => 95.25,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Systemic Pest Control (Liquid)',
                'type' => 'pesticide',
                'description' => 'Absorbed by the plant to kill sap-sucking insects.',
                'base_unit' => 'liter',
                'price_per_unit' => 145.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Broadleaf Weed Killer',
                'type' => 'pesticide',
                'description' => 'Selective post-emergence herbicide for broadleaf weeds.',
                'base_unit' => 'liter',
                'price_per_unit' => 62.99,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Acaricide (Mite Control)',
                'type' => 'pesticide',
                'description' => 'Specialized pesticide for controlling mites and spiders.',
                'base_unit' => 'liter',
                'price_per_unit' => 180.50,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Copper-Based Fungicide',
                'type' => 'pesticide',
                'description' => 'Protectant fungicide for preventing common leaf diseases.',
                'base_unit' => 'kg',
                'price_per_unit' => 55.75,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Bacillus Thuringiensis (BT)',
                'type' => 'pesticide',
                'description' => 'Organic bacterial insecticide for caterpillar control.',
                'base_unit' => 'kg',
                'price_per_unit' => 70.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Pre-Emergent Herbicide',
                'type' => 'pesticide',
                'description' => 'Controls weeds before they emerge from the soil.',
                'base_unit' => 'kg',
                'price_per_unit' => 90.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Snail and Slug Pellets',
                'type' => 'pesticide',
                'description' => 'Bait for controlling garden mollusks.',
                'base_unit' => 'kg',
                'price_per_unit' => 45.99,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Insecticidal Soap Spray',
                'type' => 'pesticide',
                'description' => 'A mild contact insecticide safe for many plants.',
                'base_unit' => 'liter',
                'price_per_unit' => 35.00,
                'status' => 'active',
                'created_at' => $now,
                'updated_at' => $now,
            ],

            // --- ARCHIVED FERTILIZERS (2 Total) ---
            [
                'name' => 'Ammonium Sulfate',
                'type' => 'fertilizer',
                'description' => 'Provides nitrogen and sulfur nutrients for soil enrichment.',
                'base_unit' => 'kg',
                'price_per_unit' => 18.75,
                'status' => 'archived',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Liquid Calcium Fertilizer',
                'type' => 'fertilizer',
                'description' => 'Liquid calcium supplement for plants, prevents blossom end rot.',
                'base_unit' => 'liter',
                'price_per_unit' => 38.90,
                'status' => 'archived',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            
            // --- ARCHIVED PESTICIDES (3 Total) ---
            [
                'name' => 'Diatomaceous Earth',
                'type' => 'pesticide',
                'description' => 'Natural powdered insecticide for crawling pests.',
                'base_unit' => 'kg',
                'price_per_unit' => 45.00,
                'status' => 'archived',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Non-Selective Contact Herbicide',
                'type' => 'pesticide',
                'description' => 'Rapid-acting herbicide that kills on contact.',
                'base_unit' => 'liter',
                'price_per_unit' => 85.00,
                'status' => 'archived',
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'name' => 'Fungicide Powder',
                'type' => 'pesticide',
                'description' => 'Older formulation fungicide powder, now discontinued.',
                'base_unit' => 'kg',
                'price_per_unit' => 50.00,
                'status' => 'archived',
                'created_at' => $now,
                'updated_at' => $now,
            ],
        ];

        // 3. RANDOMIZE the order of the items
        shuffle($items);

        // 4. Insert all 30 items into the database
        DB::table('items')->insert($items);
    }

    // --- Private method to handle table cleaning ---
    private function cleanup(): void
    {
        // Disable foreign key checks temporarily
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Truncate the 'items' table to remove all existing data and reset auto-increment
        DB::table('items')->truncate();
        
        // Enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}